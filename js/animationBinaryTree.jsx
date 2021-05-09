require('../css/animationTree.scss');

import React, { useState, useEffect } from 'react'

function BinaryTree(props) {
    // Объявление переменных состояния
    const [indexArray, setIndexArray] = useState([]),
        [indexBranch, setIndexBranch] = useState([]),
        [widthTree, setWidthTree] = useState(0),
        [objTimer, setObjTimer] = useState({timerId: null,
                                            flagTimer: 0});

    const refTree = React.createRef();

    //componentDidMount, componentDidUpdate
    useEffect(()=>{
        setIndexBranch(updateIndexBranch());
        setWidthTree(updateWidthTree());
        clearTimer();
    }, [props.tree]);
    useEffect(()=>{
        let delay = 0,
            arrayTimerId = [],
            index = 0;
        let timerId = setTimeout(function request() {
            if (index < props.tree.length) {
                clickElArray(index);
                // увеличить интервал для следующего запроса
                delay=index===props.tree.length?2000:5000*props.tree[index].branch+2000;
                timerId = setTimeout(request, delay);
                index++;
                setObjTimer({timerId,
                            flagTimer: 1});
            }
            else clearTimer();

        }, delay);
        setObjTimer({timerId,
                    flagTimer: 1});
    }, [props.tree]);

    function* animationTree(branch={}) {
        if(branch.previous) yield* animationTree(branch.previous);
        yield branch;
    }
    function* recursioIB(root,left = true) {
        if(root.right && left) yield* recursioIB(root.right, left)
        else if(root.left && !left) yield* recursioIB(root.left, left)
        yield root;
        if(root.left && left) yield* recursioIB(root.left, left)
        else if(root.right && !left) yield* recursioIB(root.right, left)
    }

    function updateWidthTree() {
        return refTree.current.offsetWidth/2
    }
    function updateIndexBranch() {
        let length = props.tree.length,
            indexBranch = new Array(length),
            left = -1,
            right = 1;
        if(length) {
            indexBranch[0] = 0;
            if(props.tree[0].left) {
                let FuncLeft = recursioIB(props.tree[0].left,true);
                for (let branch of FuncLeft){
                    indexBranch[branch.index] = left;
                    left--;
                }
            }
            if(props.tree[0].right) {
                let funcRight = recursioIB(props.tree[0].right,false);
                for (let branch of funcRight) {
                    indexBranch[branch.index] = right;
                    right++;
                }
            }
        }
        return indexBranch
    }
    function clickElArray(index) {
        let animation = animationTree(props.tree[index]),
            array = [];
        for (let branch of animation)
            array.push(branch.index);
        setIndexArray(array);
    }
    function clearTimer() {
        clearTimeout(objTimer.timerId);
        setIndexArray([]);
        setObjTimer({timerId:null,
                    flagTimer: 0});
    }

    let widthBranch = 52,
        maxHeightBranch = 50,
        heightLine = maxHeightBranch - 30 + 30/2,
        styleTree = {
            height: (Math.max(...(props.tree.length?props.tree.map(el=>el.branch):[0]))+1)*maxHeightBranch,
            left: (-1)*(widthTree + Math.min(...indexBranch.length?indexBranch:[0])*widthBranch),
        }
    return <React.Fragment>
        <div className="array">
            {
                props.oldArray.map(function (item,index) {
                    return <div onClick={clickElArray.bind(this,index)} className={Math.max(...indexArray)===index?'active':''}><p>{item}</p></div>
                })
            }
        </div>
        <div className="tree" style={styleTree} ref={refTree}>
            {
                props.tree.map(function (item,index) {

                    let style={
                            top:item.branch*maxHeightBranch,
                            left: `calc(50% + (${indexBranch[index]*widthBranch}px))`
                        },
                        styleAfter = {},
                        styleBefore = {},
                        maxIndex = Math.max(...indexArray);
                    if(indexBranch.length) {
                        if(item.left) {
                            let width = (indexBranch[index] - indexBranch[item.left.index] - 0.5)*widthBranch,
                                d = Math.sqrt(heightLine**2+width**2), //высчитываем диагональ
                                sin = heightLine/d, //...синус угла между диагональю и стороной
                                deg = Math.asin(sin) * (180/Math.PI); //...угол

                            styleAfter = {
                                width: d,
                                transform:`rotate(-${deg}deg)`,
                                left: (-1)*width
                            }
                        }
                        if(item.right) {
                            let width = (indexBranch[item.right.index] - indexBranch[index] - 0.5)*widthBranch,
                                d = Math.sqrt(heightLine**2+width**2), //высчитываем диагональ
                                sin = heightLine/d, //...синус угла между диагональю и стороной
                                deg = Math.asin(sin) * (180/Math.PI); //...угол

                            styleBefore = {
                                width: d,
                                transform:`rotate(${deg}deg)`,
                                right: (-1)*width
                            }
                        }
                        if(indexArray.includes(index)){
                            style.transitionDelay = `${item.branch*5}s`;
                            styleAfter.transitionDelay = `${item.branch*5 + 2.5}s`;
                            styleBefore.transitionDelay = `${item.branch*5 + 2.5}s`;
                        }
                    }
                    return <div className={`${indexArray.includes(index)?'active':''} ${objTimer.flagTimer&&index>maxIndex?'transparent':''}`} style={style}><p className={`after ${item.left&&indexArray.includes(item.left.index)?'active':''} ${objTimer.flagTimer&&item.left&&item.left.index>maxIndex?'transparent':''}`} style={styleAfter}>&lt;</p><p>{item.value}</p><p className={`before ${item.right&&indexArray.includes(item.right.index)?'active':''} ${objTimer.flagTimer&&item.right&&item.right.index>maxIndex?'transparent':''}`} style={styleBefore}>&le;</p></div>
                })
            }
        </div>
    </React.Fragment>
}

export default BinaryTree