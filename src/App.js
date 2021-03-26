import React, {Component} from 'react';

import {membersSheet} from 'config/sheets';

import {initGoogleApi, loadSheetData} from 'utils/googleApi';
import parseMembersSheetRow from 'utils/parseMembersSheetRow';
import formatGSSDataToTree from 'utils/formatGSSDataToTree';

import Search from 'components/search/search';
import Canvas from 'components/canvas/canvas';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      membersList: [],
      membersTree: [],
      highlightedMemberId: null,
      highlightedMemberAncestorsIds: [],
    };
  }

  componentDidMount() {
    window.gapi.load('client', async () => {
      await initGoogleApi();
      this.loadMembersData();
    });

    // Зняти виділення з мембера при будь-якому кліку
    document.addEventListener('click', () => {
      this.setState({highlightedMemberId: null});
    });

    document.addEventListener('touchstart', () => {
      this.setState({highlightedMemberId: null});
    });
  }

  loadMembersData = () => {
    loadSheetData({
      sheet: membersSheet.name,
      startRow: membersSheet.startRow,
      rowWidth: membersSheet.columnsOrder.length,
    }, (err, data) => {
      if (err) {
        console.log(err);
        return;
      }

      const parsedData = data.map(parseMembersSheetRow);

      this.setState({
        membersList: parsedData,
        membersTree: formatGSSDataToTree(parsedData),
      });
    });
  }

  render() {
    const {
      membersList,
      membersTree,
      highlightedMemberId,
      highlightedMemberAncestorsIds,
    } = this.state;

    return (
      <>
        <Search
          membersList={membersList}
          highlightMember={this.highlightMember}
        />
        <Canvas
          membersTree={membersTree}
          highlightedMemberId={highlightedMemberId}
          highlightedMemberAncestors={highlightedMemberAncestorsIds}
        />
      </>
    );
  }

  highlightMember = id => {
    this.setState({
      highlightedMemberId: id,
      highlightedMemberAncestorsIds: this.getHighlightedMemberAncestorsIds(id),
    });
  }

  getHighlightedMemberAncestorsIds = id => {
    const {membersList} = this.state;

    let currentMember = membersList.filter(member => member.id === id)[0];

    if (!currentMember) return [];

    const ancestorsIds = [];

    while (currentMember.parent) {
      const parentName = currentMember.parent;
      currentMember = membersList.filter(member => member.name === parentName)[0];
      ancestorsIds.push(currentMember.id);
    }

    return ancestorsIds;
  }
}

export default App;
