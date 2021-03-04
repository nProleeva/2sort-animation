require('../css/sortBubble.scss');

import React from 'react'

function* sort(array, method){
    let newArray = new Array(...array);
    for(let i=0;i<(newArray.length-1);i++)
        for (let j=0;j<(newArray.length-1); j++) {
            let min = newArray[j] < newArray[j+1],
                equally = newArray[j] === newArray[j+1],
                flagSwap = (min && method.waning) || (!min && !equally && method.increase);
            if(flagSwap) newArray[j+1] = newArray.splice(j,1, newArray[j+1])[0];
            yield {
                array: newArray,
                numberBubble: j,
                flagSwap: flagSwap
            };
        }
}

class SortBubble extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            newArray:props.array,
            oldArray:props.array,
            array:props.array,
            numberBubble: 0,
            flagSwap: false,
            timerId: null,
            cancel: false,
            done: false
        }

        this.sort = sort(props.array, props.method);
        this.updateState = this.updateState.bind(this);
        this.cancel = this.cancel.bind(this);
    }
    componentDidMount() {
        this.updateState();
    }
    componentDidUpdate() {
        if(this.state.oldArray!==this.props.array) {
            this.setState({
                newArray: this.props.array,
                oldArray: this.props.array,
                array: this.props.array,
                numberBubble: 0,
                flagSwap: false,
                timerId: null,
                cancel: false,
                done: false
            });
            this.sort = sort(this.props.array, this.props.method);
            this.updateState();
        }
    }
    cancel() {
        if(!this.state.cancel) {
            clearInterval(this.state.timerId);
            this.setState( state=>{
                let obj = state;
                obj.array = new Array(...obj.newArray);
                obj.cancel = true;
                obj.flagSwap = -1;
                return obj;
            });
        }
    }
    updateState() {
        this.cancel();
        let next = this.sort.next();
        if(!next.done) {
            let newState = next.value;
            const timerId = setTimeout(()=>{
                const newTimerId = setTimeout(()=> {
                    this.setState({
                        array: new Array(...newState.array),
                        flagSwap: -1,
                        cancel: true
                    })
                },4000);
                this.setState({
                    flagSwap: newState.flagSwap,
                    timerId: newTimerId
                });
            }, 2000);
            this.setState({
                newArray: new Array(...newState.array),
                numberBubble: newState.numberBubble,
                flagSwap: -1,
                timerId: timerId,
                cancel: false
            });
        }
        else this.setState({done: next.done});
    }
    render() {
        const _this = this;
        function outputFlagSwap($1,$2='',$3=''){
            return _this.state.flagSwap>0 ? $1 : _this.state.flagSwap===false? $2:$3
        }
        return <div className="bubble">
            <div className="array">
            {
                _this.state.array.map(function (item, index) {
                    let classSide = "";
                    if((index===_this.state.numberBubble || index===(_this.state.numberBubble+1)) && !_this.state.done) {
                        if (index===_this.state.numberBubble) classSide = `leftSide ${outputFlagSwap('red','green')} ${outputFlagSwap('right')}`;
                        else classSide = `rightSide ${outputFlagSwap('red','green')} ${outputFlagSwap('left')}`;
                    }
                    return <div className={classSide}><p>{item}</p></div>
                })
            }
            </div>
            {!_this.state.cancel && <div className="comparison"><p>{_this.state.array[_this.state.numberBubble]} {_this.props.method.increase? '≤' : '≥'} {_this.state.array[_this.state.numberBubble+1]} = {outputFlagSwap('false','true ','?    ')}</p></div>}
            <button onClick={_this.updateState} disabled={_this.state.done}>Следующая операчия</button>
            {_this.state.done && <p>Сортировка закончена</p>}
        </div>
    }
}

export default SortBubble