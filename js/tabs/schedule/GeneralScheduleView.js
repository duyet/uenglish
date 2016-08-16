/**
 * Copyright 2016 Facebook, Inc.
 *
 * You are hereby granted a non-exclusive, worldwide, royalty-free license to
 * use, copy, modify, and distribute this software in source code or binary
 * form for use in connection with the web services and APIs provided by
 * Facebook.
 *
 * As with any software that integrates with the Facebook platform, your use
 * of this software is subject to the Facebook Developer Principles and
 * Policies [http://developers.facebook.com/policy/]. This copyright notice
 * shall be included in all copies or substantial portions of the software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE
 *
 * @flow
 */
'use strict';

var EmptySchedule = require('./EmptySchedule');
var FilterHeader = require('./FilterHeader');
var FilterSessions = require('./filterSessions');
var ListContainer = require('ListContainer');
var Navigator = require('Navigator');
var React = require('React');
var Platform = require('Platform');
var F8DrawerLayout = require('F8DrawerLayout');
var ScheduleListView = require('./ScheduleListView');
var LessionListView = require('./LessionListView');
var FilterScreen = require('../../filter/FilterScreen');

var { connect } = require('react-redux');
var {switchDay, switchLession} = require('../../actions');

import type {Session} from '../../reducers/sessions';

// TODO: Move from reselect to memoize?
var { createSelector } = require('reselect');

const data = createSelector(
  (store) => store.sessions,
  (store) => store.filter,
  (sessions, filter) => FilterSessions.byTopics(sessions, filter),
);

type Props = {
  filter: any;
  day: number;
  lession: number;
  level: number;
  sessions: Array<Session>;
  navigator: Navigator;
  logOut: () => void;
  switchDay: (day: number) => void;
  switchLession: (lession: number) => void;
};

class GeneralScheduleView extends React.Component {
  props: Props;
  _drawer: ?F8DrawerLayout;

  constructor(props) {
    super(props);

    (this: any).renderEmptyList = this.renderEmptyList.bind(this);
    (this: any).switchDay = this.switchDay.bind(this);
    (this: any).switchLession = this.switchLession.bind(this);
    (this: any).openFilterScreen = this.openFilterScreen.bind(this);
    (this: any).renderNavigationView = this.renderNavigationView.bind(this);
  }

  render() {
    const filterItem = {
      icon: require('../../common/img/filter.png'),
      title: 'Filter',
      onPress: this.openFilterScreen,
    };

    const filterHeader = Object.keys(this.props.filter).length > 0
      ? <FilterHeader />
      : null;

    const content = (
      <ListContainer
        title="Lessons"
        selectedSegment={this.props.lession - 1}
        onSegmentChange={this.switchLession}
        backgroundImage={require('./img/schedule-background.png')}
        backgroundColor="#5597B8"
        selectedSectionColor="#51CDDA"
        stickyHeader={filterHeader}
        rightItem={filterItem}>
        <LessionListView
          title="Level 1"
          lession={1}
          sessions={this.props.sessions}
          renderEmptyList={this.renderEmptyList}
          navigator={this.props.navigator}
        />
        <LessionListView
          title="Level 2"
          lession={2}
          sessions={this.props.sessions}
          renderEmptyList={this.renderEmptyList}
          navigator={this.props.navigator}
        />
        <LessionListView
          title="Level 3"
          lession={3}
          sessions={this.props.sessions}
          renderEmptyList={this.renderEmptyList}
          navigator={this.props.navigator}
        />
        <LessionListView
          title="Level 4"
          lession={4}
          sessions={this.props.sessions}
          renderEmptyList={this.renderEmptyList}
          navigator={this.props.navigator}
        />
      </ListContainer>
    );

    if (Platform.OS === 'ios') {
      return content;
    }
    return (
      <F8DrawerLayout
        ref={(drawer) => { this._drawer = drawer; }}
        drawerWidth={300}
        drawerPosition="right"
        renderNavigationView={this.renderNavigationView}>
        {content}
      </F8DrawerLayout>
    );
  }

  renderNavigationView() {
    return <FilterScreen onClose={() => this._drawer && this._drawer.closeDrawer()} />;
  }

  renderEmptyList() {
    return (
      <EmptySchedule
        title={`No lession for this level`}
        text="Please check and try again later."
      />
    );
  }

  openFilterScreen() {
    if (Platform.OS === 'ios') {
      this.props.navigator.push({ filter: 123 });
    } else {
      this._drawer && this._drawer.openDrawer();
    }
  }

  switchDay(page) {
    this.props.switchDay(page + 1);
  }

  switchLession(page) {
    this.props.switchLession(page + 1);
  }
}

function select(store) {
  return {
    day: store.navigation.day,
    lession: store.navigation.lession,
    filter: store.filter,
    sessions: data(store),
  };
}

function actions(dispatch) {
  return {
    switchDay: (day) => dispatch(switchDay(day)),
    switchLession: (day) => dispatch(switchLession(day)),
  };
}

module.exports = connect(select, actions)(GeneralScheduleView);
