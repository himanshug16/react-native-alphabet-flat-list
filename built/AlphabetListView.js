/**
 * Created by JetBrains WebStorm.
 * Author: yoon
 * Date: 19-9-3
 * Time: 下午9:32
 * Desc: 字母列表
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import React, { PureComponent } from 'react';
import { PanResponder, View, InteractionManager } from 'react-native';
import SectionListItem from './SectionListItem';
import Toast from "./Toast";
var initState = {
    selectAlphabet: '',
    itemHeight: 0
};
var AlphabetListView = /** @class */ (function (_super) {
    __extends(AlphabetListView, _super);
    function AlphabetListView(props) {
        var _this = _super.call(this, props) || this;
        _this.onTouchChange = function (e, gestureState) {
            var itemHeight = _this.props.contentHeight / _this.props.titles.length;
            var event = e.nativeEvent || {};
            var index = Math.floor((event.pageY - _this.props.pageY) / itemHeight);
            if (index >= 0 && index <= (_this.props.titles.length - 1)) {
                _this.props.onSelect && _this.props.onSelect(index);
                _this.updateSelectAlphabet(_this.props.titles[index]);
                if (_this.props.alphabetToast) {
                    InteractionManager.runAfterInteractions(function () {
                        Toast.show(_this.props.titles[index]);
                    });
                }
            }
        };
        _this.responder = PanResponder.create({
            onStartShouldSetPanResponderCapture: function () { return true; },
            onStartShouldSetPanResponder: function () { return true; },
            onPanResponderTerminationRequest: function () { return true; },
            onPanResponderGrant: (_this.onTouchChange),
            onPanResponderMove: (_this.onTouchChange)
        });
        _this.state = initState;
        return _this;
    }
    AlphabetListView.prototype.componentDidMount = function () {
        this.initData(this.props);
    };
    AlphabetListView.prototype.componentWillReceiveProps = function (props) {
        this.initData(props);
    };
    AlphabetListView.prototype.updateSelectAlphabet = function (selectAlphabet) {
        this.setState({
            selectAlphabet: selectAlphabet
        });
    };
    AlphabetListView.prototype.initData = function (_a) {
        var titles = _a.titles, contentHeight = _a.contentHeight;
        this.setState({
            selectAlphabet: titles[0],
            itemHeight: contentHeight / titles.length
        });
    };
    AlphabetListView.prototype.render = function () {
        var _a = this.state, selectAlphabet = _a.selectAlphabet, itemHeight = _a.itemHeight;
        // 解决键盘谈起后压缩到一起的问题
        if (itemHeight < 13) {
            return null;
        }
        var _b = this.props, topPosition = _b.topPosition, contentHeight = _b.contentHeight, titles = _b.titles;
        return (<View style={{
            position: 'absolute',
            top: topPosition,
            right: 5,
            zIndex: 10,
            height: contentHeight
        }} {...this.responder.panHandlers}>
        {titles.map(function (title) { return (<SectionListItem key={title} height={itemHeight} title={title} active={selectAlphabet === title}/>); })}
      </View>);
    };
    return AlphabetListView;
}(PureComponent));
export default AlphabetListView;
