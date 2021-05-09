require('../css/form.scss');

import React from 'react'
import {connect} from 'react-redux'
import {fetchArrayAction} from './redux/reducerArray.js'

class Form extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            sort: {
                bubble: true,
                binaryTree: false
            },
            arrayRadio: {
                yourArray: false,
                random: true
            },
            array: {
                text: "",
                min: "",
                max: "",
                n: "",
                status: ""
            },
            method: {
                increase: true,
                waning: false
            }

        }
        this.handleQuantity = this.handleQuantity.bind(this);
        this.handleBegin = this.handleBegin.bind(this);
        this.handleRandom = this.handleRandom.bind(this);
        this.handleInputText = this.handleInputText.bind(this);
    }
    //handleRadio преднназначена для всех radio в for, nameObj объект объединенных input
    handleRadio(nameObj, event) {
        this.setState((state)=>{
            let obj = state;
            for (let variable in obj[nameObj]) {
                obj[nameObj][variable] = false;
            }
            obj[nameObj][event.target.id] = event.target.checked;
            return obj;
        });
    }
    //правильно заполнить input массива
    handleInputText(event) {
        let value = event.target.value.replace(/[^0-9,\-]/g,'');
        if(value.search(/\-\-|[0-9]\-/)>-1) value = value.replace(/\-\-|[0-9]\-/,all=>all.replace(/\-$/,''));
        if(value.search(/\-0/)>-1) value = value.replace(/\-0/,'0');
        if(value.search(/(^,|,,|\-,)/)>-1) value = value.replace(/(^,|,,|\-,)/,all=>all.replace(/,$/,''));
        if(value.search(/\-?[0-9]{5,}/)>-1) value = value.replace(/[0-9]{5,}/,all=>all.replace(/[0-9]$/,''));
        this.setState((state)=> {
            let obj = state;
            obj.array.text = value;
            return obj;
        });
    }
    //правильно заполнить input рандомного масиива, минимальное и максимальное значение массива
    handleRandom(event) {
        let value = event.target.value.replace(/[^0-9\-]/g,'');
        if(/^\-0/.test(value)) value = value.replace(/^\-/,'');
        if(value.length > 1 && !/^\-/.test(value)) value = value.replace(/^0/,'');
        if(/\-$/.test(value) && value.length > 1) value = value.replace(/\-$/,'');
        if(value.search(/^\-?[0-9]{5,}$/)===0) value = value.replace(/[0-9]$/,'');
        this.setState((state)=> {
            let obj = state;
            obj.array[event.target.id] = value;
            return obj;
        });
    }
    //количество элементов в массиве(random)
    handleQuantity(event) {
        let value = event.target.value.replace(/[^0-9]/g,'').replace(/^0/,'');
        if(value.search(/^[0-9]{4,}$/)===0) value = value.replace(/[0-9]$/,'');
        this.setState((state)=> {
            let obj = state;
            obj.array.n = value;
            return obj;
        });
    }
    getRandomIntInclusive(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
    }
    //создается неотсортированный массив
    handleBegin(event) {
        let array=[];
        if(this.state.arrayRadio.random) {
            if (Number.parseInt === undefined) {
                Number.parseInt = window.parseInt;
            }
            const min = Number.parseInt(this.state.array.min),
                max = Number.parseInt(this.state.array.max),
                quantity = Number.parseInt(this.state.array.n);
            if (min > max) {
                this.setState((state)=> {
                    let obj = state;
                    obj.array.status = "red";
                    return obj;
                });
                event.preventDefault();
                return false;
            }

            for (let i = 0; i < quantity; i++) array.push(this.getRandomIntInclusive(min, max))
        }
        else if(this.state.arrayRadio.yourArray) {
            array = this.state.array.text.replace(/,$/,'').split(',').map(el=>Number.parseInt(el));
        }
        this.props.fetchArray(this.state.sort,this.state.method,array);
        this.setState((state)=> {
            let obj = state;
            obj.array.status = "";
            return obj;
        });
        event.preventDefault();
    }
    render() {
        return <form className="col-sm-12 col-md-4" onSubmit={this.handleBegin}>
            <div className="sort">
                <input type="radio" name="sort" id="bubble" checked={this.state.sort.bubble} onChange={this.handleRadio.bind(this, 'sort')}/>
                <label htmlFor="bubble">Сортировка Пузырьком O(n<sup><small>2</small></sup>)</label>
                <input type="radio" name="sort" id="binaryTree" checked={this.state.sort.binaryTree} onChange={this.handleRadio.bind(this, 'sort')}/>
                <label htmlFor="binaryTree">Сортировка бинарным деревом O(nlogn)</label>
            </div>
            <div className="array">
                <input type="radio" name="array" id="yourArray" checked={this.state.arrayRadio.yourArray} onChange={this.handleRadio.bind(this, 'arrayRadio')}/>
                <label htmlFor="yourArray">Свой массив</label>
                <input type="radio" name="array" id="random" checked={this.state.arrayRadio.random} onChange={this.handleRadio.bind(this, 'arrayRadio')}/>
                <label htmlFor="random">random</label>
                <div className="optionsArray">
                    <input type="text" onChange={this.handleInputText} value={this.state.array.text} className={this.state.arrayRadio.yourArray?'d-block':'d-none'} required={this.state.arrayRadio.yourArray} title="1,2,3,4"/>
                    <div className={this.state.arrayRadio.random?'d-block':'d-none'}>
                        <input type="text" value={this.state.array.min} id="min" onChange={this.handleRandom} className={this.state.array.status} required={this.state.arrayRadio.random} title="-1"/>
                        <label htmlFor="min">min</label>
                        <input type="text" value={this.state.array.max} id="max" onChange={this.handleRandom} className={this.state.array.status} required={this.state.arrayRadio.random} title="1"/>
                        <label htmlFor="max">max</label>
                        <input type="text" value={this.state.array.n} id="quantity" onChange={this.handleQuantity} required={this.state.arrayRadio.random} title="1"/>
                        <label htmlFor="quantity">quantity</label>
                    </div>
                </div>
            </div>
            <div className="method">
                <input type="radio" name="method" id="increase" checked={this.state.method.increase} onChange={this.handleRadio.bind(this, 'method')}/>
                <label htmlFor="increase">По Возрастаниию</label>
                <input type="radio" name="method" id="waning" checked={this.state.method.waning} onChange={this.handleRadio.bind(this, 'method')}/>
                <label htmlFor="waning">По Убыванию</label>
            </div>
            <input type="submit" value="Начать" />
            {this.state.array.status.length > 0 && <p>Должно быть min &le; max</p>}
        </form>
    }
}
export default connect(null,{fetchArray:fetchArrayAction})(Form);