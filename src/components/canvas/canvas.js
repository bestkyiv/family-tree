import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Placeholder from './placeholder/placeholder';
import Member from './member/member';

import './canvas.scss';

const propTypes = {
  membersTree: PropTypes.array,
  highlightedMemberId: PropTypes.string,
  highlightedMemberAncestors: PropTypes.arrayOf(PropTypes.string),
};

const defaultProps = {
  membersTree: [],
  highlightedMemberId: null,
  highlightedMemberAncestors: [],
}

const initialState = {
  position: {x: 0, y: 0},
  grabbed: false,
  grabCoords: {x: null, y: null},
};

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.canvasRef = React.createRef();
  }

  render() {
    const { membersTree } = this.props;

    const canvasClasses = classnames('canvas', {
      'canvas_grabbed': this.state.grabbed,
    });

    return (
      <>
        <Placeholder visible={!membersTree.length}/>
        <div
          ref={this.canvasRef}
          className={canvasClasses}
          onMouseDown={this.startDragging}
          onMouseUp={this.stopDragging}
          onMouseLeave={this.stopDragging}
          onMouseMove={this.onDragging}
        >
          <div className="canvas__members-container">
            { membersTree.map(member => this.buildTreeBranch(member)) }
          </div>
        </div>
      </>
    );
  }

  buildTreeBranch(member, hasParent = false) {
    const {highlightedMemberId, highlightedMemberAncestors} = this.props;

    return <Member
      key={member.id}
      id={member.id}
      picture={member.picture}
      name={member.name}
      status={member.status}
      active={member.active}
      recDate={member.recDate}
      birthday={member.birthday}
      family={member.family}
      hasParent={hasParent}
      highlighted={highlightedMemberId === member.id}
      showChildren={highlightedMemberAncestors.includes(member.id)}
    >
      {
        member.hasOwnProperty('children') && member.children.length > 0 &&
          member.children.map(child => this.buildTreeBranch(child, true))
      }
    </Member>
  }

  startDragging = e => {
    this.setState({
      grabbed: true,
      grabCoords: {
        x: e.pageX,
        y: e.pageY,
      },
      position: {
        x: this.canvasRef.current.scrollLeft,
        y: this.canvasRef.current.scrollTop,
      }
    });
  }

  stopDragging = e => {
    this.setState({
      grabbed: false,
      grabCoords: {x: null, y: null}
    });
  }

  onDragging = e => {
    const {position, grabCoords, grabbed} = this.state;

    if (!grabbed) return;

    const offsetX = position.x + grabCoords.x - e.pageX;
    const offsetY = position.y + grabCoords.y - e.pageY;
    this.canvasRef.current.scroll(offsetX, offsetY);
  }
}

Canvas.propTypes = propTypes;
Canvas.defaultProps = defaultProps;

export default Canvas;
