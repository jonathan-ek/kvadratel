import './App.css';
import {useState, useEffect, useRef} from 'react';
import PropTypes from "prop-types";

const Tile = ({
                  dataKey,
                  onMouseDown,
                  onMouseMove,
                  onMouseUp,
                  children,
                  defaultStyle,
                  cellFrequency,
                  startFrequency,
                  showStartFrequency,
                  correctAnimation,
              }) => {
    const [isActive, setIsActive] = useState(!defaultStyle);
    const elementRef = useRef(null);

    useEffect(() => {
        if (defaultStyle) {
            setIsActive(false);
        }
    }, [defaultStyle]);

    const handleMouseEnterLeave = (e) => {
        setIsActive(e.buttons === 1);
    };

    const handleMouseDown = () => {
        setIsActive(true);
        onMouseDown();
    };

    const handleMouseUp = () => {
        setIsActive(false);
        onMouseUp();
    };

    const handleTouchStart = () => {
        const rect = elementRef.current.getBoundingClientRect();
        elementRef.current.dataset.rect = JSON.stringify(rect);
        setIsActive(true);
        onMouseDown();
    };

    const handleTouchMove = (e) => {
        const rect = elementRef.current.getBoundingClientRect();
        const touch = e.touches[0];
        const {clientX, clientY} = touch;

        setIsActive(
            clientX >= rect.left && clientX <= rect.right &&
            clientY >= rect.top && clientY <= rect.bottom
        );
    };

    const getTileStyle = () => {
        if (correctAnimation) {
            return {
                scale: "1.03",
                color: "rgb(0,6,20)",
                backgroundColor: "rgb(29,161,17)",
                cursor: "pointer",
                userSelect: "none",
                position: "relative",
            };
        }
        if (!defaultStyle) {
            if (isActive || !defaultStyle) {
                return {
                    scale: "1.03",
                    color: "rgb(0,6,20)",
                    backgroundColor: "rgb(180, 180, 180)",
                    cursor: "pointer",
                    userSelect: "none",
                    position: "relative",
                };
            }
        }
        if (cellFrequency === 0) {
            return {
                color: "rgb(154,154,154)",
                backgroundColor: "rgb(25,40,67)"
            };
        } else {
            return {
                cursor: "pointer",
                userSelect: "none",
                position: "relative",
            };
        }
    };

    return (
        <div className="tile" style={getTileStyle()}>
            <div
                className='content'
                ref={elementRef}
                style={{height: "85px", width: "85px"}}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                onMouseMove={onMouseMove}
                onTouchMove={handleTouchMove}
                onMouseUp={handleMouseUp}
                onTouchEnd={handleMouseUp}
                onMouseLeave={handleMouseEnterLeave}
                onMouseEnter={handleMouseEnterLeave}
            >
                <div data-key={dataKey} style={{display: 'block'}}>
                    <h1 style={{margin: "0px"}}>{children}</h1>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        {showStartFrequency && (
                            <p style={{color: '#fafafa', margin: 0}}>{startFrequency || ''}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

Tile.propTypes = {
    dataKey: PropTypes.string,
    onMouseDown: PropTypes.func,
    onMouseMove: PropTypes.func,
    onMouseUp: PropTypes.func,
    children: PropTypes.string,
    defaultStyle: PropTypes.bool,
    cellFrequency: PropTypes.number,
    startFrequency: PropTypes.number,
    showStartFrequency: PropTypes.bool,
    correctAnimation: PropTypes.bool,
};

export default Tile;