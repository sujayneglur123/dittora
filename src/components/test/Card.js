import * as React from 'react'
import { findDOMNode } from 'react-dom'
import PropTypes from 'prop-types';
import {
    DragSource,
    DropTarget,
    ConnectDropTarget,
    ConnectDragSource,
    DropTargetMonitor,
    DropTargetConnector,
    DragSourceConnector,
    DragSourceMonitor,
} from 'react-dnd'
//import ItemTypes from './ItemTypes'
import { XYCoord } from 'dnd-core'

import flow from 'lodash.flow';

const style = {
    border: '1px dashed gray',
    padding: '0.5rem 1rem',
    marginBottom: '.5rem',
    backgroundColor: 'white',
    cursor: 'move',
}

const cardSource = {
    beginDrag(props) {
        return {
            id: props.id,
            index: props.index,
        }
    },
}

const cardTarget = {
    hover(props, monitor, component) {
        if (!component) {
            return null
        }
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;

        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
            return
        }

        // Determine rectangle on screen
        const hoverBoundingRect = (findDOMNode(
            component,
        )).getBoundingClientRect();

        // Get vertical middle
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

        // Determine mouse position
        const clientOffset = monitor.getClientOffset();

        // Get pixels to the top
        const hoverClientY = (clientOffset).y - hoverBoundingRect.top;

        // Only perform the move when the mouse has crossed half of the items height
        // When dragging downwards, only move when the cursor is below 50%
        // When dragging upwards, only move when the cursor is above 50%

        // Dragging downwards
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
            return
        }

        // Dragging upwards
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
            return
        }

        // Time to actually perform the action
        props.moveCard(dragIndex, hoverIndex);

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        monitor.getItem().index = hoverIndex;
    },
}

/*export interface CardProps {
    id: any
    text: string
    index: number
    isDragging?: boolean
    connectDragSource?: ConnectDragSource
    connectDropTarget?: ConnectDropTarget
    moveCard: (dragIndex: number, hoverIndex: number) => void
}*/

/*@DropTarget('card', cardTarget, (connect) => ({
    connectDropTarget: connect.dropTarget(),
}))
@DragSource(
    'card',
    cardSource,
    (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    }),
)*/


class Card extends React.Component {

   /* static propTypes = {
        connectDragSource: PropTypes.func.isRequired,
        connectDropTarget: PropTypes.func.isRequired,
        index: PropTypes.number.isRequired,
        isDragging: PropTypes.bool.isRequired,
        id: PropTypes.any.isRequired,
        text: PropTypes.string.isRequired,
        moveCard: PropTypes.func.isRequired,
    };*/

    render() {
        const {
            text,
            isDragging,
            connectDragSource,
            connectDropTarget,
        } = this.props;
        const opacity = isDragging ? 0 : 1;

        console.log("In Card");

        return (
            connectDragSource &&
            connectDropTarget &&
            connectDragSource(
                connectDropTarget(<div style={{ style, opacity }}>{text}</div>),
            )
        )
    }
}

export default flow(

    DragSource(
        'card',
        cardSource,
        (connect, monitor) => ({
            connectDragSource: connect.dragSource(),
            isDragging: monitor.isDragging(),
        }),
    ),

    DropTarget('card', cardTarget, (connect) => ({
    connectDropTarget: connect.dropTarget(),
}))
)(Card);



















































/*
import * as React from 'react'
import {
    DragSource,
    DropTarget,
    ConnectDragSource,
    ConnectDropTarget,
    DragSourceMonitor,
    DropTargetMonitor,
} from 'react-dnd'
//import ItemTypes from './ItemTypes';

import flow from 'lodash.flow';

const style = {
    border: '1px dashed gray',
    padding: '0.5rem 1rem',
    marginBottom: '.5rem',
    backgroundColor: 'white',
    cursor: 'move',
}

const cardSource = {
    beginDrag(props) {
        return {
            id: props.id,
            originalIndex: props.findCard(props.id).index,
        }
    },

    endDrag(props, monitor) {
        const { id: droppedId, originalIndex } = monitor.getItem()
        const didDrop = monitor.didDrop()

        if (!didDrop) {
            props.moveCard(droppedId, originalIndex)
        }
    },
}

const cardTarget = {
    canDrop() {
        return false
    },

    hover(props, monitor) {
        const { id: draggedId } = monitor.getItem()
        const { id: overId } = props

        if (draggedId !== overId) {
            const { index: overIndex } = props.findCard(overId)
            props.moveCard(draggedId, overIndex)
        }
    },
}

/!*export interface CardProps {
    id: string
    text: string
    connectDragSource?: ConnectDragSource
    connectDropTarget?: ConnectDropTarget
    isDragging?: boolean
    moveCard: (id: string, to: number) => void
        findCard: (id: string) => { index: number }
}*!/

/!*@DropTarget(ItemTypes.CARD, cardTarget, connect => ({
    connectDropTarget: connect.dropTarget(),
}))
@DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
}))*!/

class Card extends React.Component {
    render() {
        const {
            text,
            isDragging,
            connectDragSource,
            connectDropTarget,
        } = this.props
        const opacity = isDragging ? 0 : 1

        return (
            connectDragSource &&
            connectDropTarget &&
            connectDragSource(
                connectDropTarget(<div style={{ ...style, opacity }}>{text}</div>),
            )
        )
    }
}

export default flow(
    DragSource('card', cardSource, (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    })),
    DropTarget('card', cardTarget, connect => ({
        connectDropTarget: connect.dropTarget(),
    }))
)(Card);*/
