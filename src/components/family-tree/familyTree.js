import React, {Component} from 'react';
import PropTypes from 'prop-types';

import formatGSSDataToTree from 'utils/formatGSSDataToTree';

import Loader from 'components/loader/loader';

import Search from './search/search';
import Canvas from './canvas/canvas';
import Member from './member/member';

import './familyTree.scss';

const propTypes = {
  membersList: PropTypes.array,
};

class FamilyTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      highlightedMemberId: null,
      highlightedMemberAncestors: [],
    };
  }

  componentDidMount() {
    // Зняти виділення з мембера при будь-якому кліку
    document.addEventListener('click', this.resetHighlighting);
    document.addEventListener('touchstart', this.resetHighlighting);
  }

  render() {
    const { membersList } = this.props;

    return !membersList.length ? <Loader /> : (
      <>
        <Search
          membersList={membersList}
          highlightMember={this.highlightMember}
        />
        <Canvas>
          <div className="members-container">
            {this.buildTree()}
          </div>
        </Canvas>
      </>
    );
  }

  buildTree() {
    const { membersList } = this.props;

    const membersTree = formatGSSDataToTree(membersList);
    return membersTree.map(memberInfo => this.buildTreeBranch(memberInfo));
  }

  buildTreeBranch(memberInfo, hasParent = false) {
    const {highlightedMemberId, highlightedMemberAncestors} = this.state;

    return <Member
      key={memberInfo.id}
      info={memberInfo}
      hasParent={hasParent}
      highlighted={highlightedMemberId === memberInfo.id}
      showChildren={highlightedMemberAncestors.includes(memberInfo.id)}
    >
      {
        memberInfo.hasOwnProperty('children') && memberInfo.children.length > 0 &&
        memberInfo.children.map(childInfo => this.buildTreeBranch(childInfo, true))
      }
    </Member>
  }

  highlightMember = id => {
    this.setState({
      highlightedMemberId: id,
      highlightedMemberAncestors: this.getHighlightedMemberAncestorsIds(id),
    });
  }

  resetHighlighting = () => {
    this.setState({
      highlightedMemberId: null,
      highlightedMemberAncestors: [],
    });
  }

  getHighlightedMemberAncestorsIds = id => {
    const {membersList} = this.props;

    const ancestorsIds = [];
    let currentMember = membersList.filter(member => member.id === id)[0];

    if (currentMember) {
      while (currentMember.parent) {
        const parentName = currentMember.parent;
        currentMember = membersList.filter(member => member.name === parentName)[0];
        ancestorsIds.push(currentMember.id);
      }
    }

    return ancestorsIds;
  }
}

FamilyTree.propTypes = propTypes;

export default FamilyTree;
