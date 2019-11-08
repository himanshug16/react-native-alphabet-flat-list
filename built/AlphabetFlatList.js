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
/**
 * Created by JetBrains WebStorm.
 * Author: yoon
 * Date: 19-9-3
 * Time: 下午6:43
 * Desc:
 */
import React, { Component } from 'react';
import { Dimensions, FlatList, InteractionManager, View } from "react-native";
import SectionHeader, { sectionHeaderHeight } from './SectionHeader';
import styles from "./styles";
import AlphabetListView from "./AlphabetListView";
var defaultProps = {
    headerHeight: 0,
    sectionHeaderHeight: sectionHeaderHeight,
    renderSectionHeader: SectionHeader,
    alphabetToast: true
};
var windowHeight = Dimensions.get('window').height;
var AlphabetFlatList = /** @class */ (function (_super) {
    __extends(AlphabetFlatList, _super);
    function AlphabetFlatList(props, context) {
        var _this = _super.call(this, props, context) || this;
        /**
         * 用于解决点击字母后又触发 onViewableItemsChanged 导致选中的字母与点击的字母不一致问题
         * @type {boolean}
         */
        _this.touchedTime = 0;
        /**
         * 计算所需要的数据
         * @param data
         */
        _this.refreshBaseData = function (data) {
            var titles = Object.keys(data);
            var offset = function (index, itemLength) { return index * _this.props.sectionHeaderHeight + itemLength * _this.props.itemHeight; };
            var itemLayout = titles.map(function (title, index) {
                var beforeItemLength = titles
                    .slice(0, index)
                    .reduce(function (length, item) { return length + data[item].length; }, 0);
                var itemLength = data[title].length;
                return {
                    title: title,
                    itemLength: itemLength,
                    beforeItemLength: beforeItemLength,
                    length: _this.props.sectionHeaderHeight + _this.props.itemHeight * itemLength,
                    offset: offset(index, beforeItemLength) + _this.props.headerHeight
                };
            });
            // 计算首屏渲染的数量 避免出现空白区域
            var initialNumToRender = itemLayout.findIndex(function (item) { return item.offset >= _this.state.containerHeight; });
            if (initialNumToRender < 0) {
                initialNumToRender = titles.length;
            }
            _this.setState({
                itemLayout: itemLayout,
                titles: titles,
                selectAlphabet: titles[0],
                initialNumToRender: initialNumToRender
            });
        };
        /**
         * 获取列表区域高度，用于计算字母列表的显示
         */
        _this.onLayout = function (e) {
            try {
                // 保证导航动画完成之后在进行获取位置坐标 否则会不准确
                InteractionManager.runAfterInteractions(function () {
                    if (_this.container) {
                        _this.container.measure(function (x, y, w, h, px, py) {
                            _this.setState({
                                pageY: py
                            });
                        });
                    }
                });
                _this.setState({
                    containerHeight: e.nativeEvent.layout.height - _this.props.headerHeight
                });
            }
            catch (error) {
                console.error('捕获错误', error);
            }
        };
        /**
         * 点击字母触发滚动
         */
        _this.onSelect = function (index) {
            if (_this.list) {
                _this.list.scrollToIndex({ index: index, animated: true });
            }
            _this.touchedTime = new Date().getTime();
        };
        /**
         * 可视范围内元素变化时改变所选字母
         * @param info
         */
        _this.onViewableItemsChanged = function (info) {
            if (info.viewableItems.length) {
                // 点击字母触发的滚动3秒内不响应
                if ((new Date().getTime() - _this.touchedTime) < 500) {
                    return;
                }
                if (_this.alphabetList) {
                    _this.alphabetList.updateSelectAlphabet(info.viewableItems[0].item);
                }
            }
        };
        _this.getItemLayout = function (data, index) { return ({
            length: _this.state.itemLayout[index].length,
            offset: _this.state.itemLayout[index].offset,
            index: index
        }); };
        _this.renderItem = function (info) {
            return (<View key={info.index}>
        {/* {_this.props.renderSectionHeader && _this.props.renderSectionHeader({ title: info.item })} */}
        {_this.props.data[info.item].map(function (itemValue, itemIndex, items) { return _this.props.renderItem({
                item: itemValue,
                index: itemIndex,
                last: itemIndex === items.length - 1
            }); })}
      </View>);
        };
        _this.state = {
            containerHeight: windowHeight,
            itemLayout: [],
            titles: [],
            selectAlphabet: '',
            initialNumToRender: 0,
            pageY: 0
        };
        return _this;
    }
    AlphabetFlatList.prototype.componentDidMount = function () {
        this.refreshBaseData(this.props.data);
    };
    AlphabetFlatList.prototype.componentWillReceiveProps = function (nextProps) {
        if (nextProps.data !== this.props.data) {
            this.refreshBaseData(nextProps.data);
        }
    };
    AlphabetFlatList.prototype.render = function () {
        var _this = this;
        return (<View style={styles.container} ref={function (ref) {
            _this.container = ref;
        }} onLayout={this.onLayout}>
        <FlatList ref={function (ref) {
            _this.list = ref;
        }} {...this.props} data={this.state.titles} renderItem={this.renderItem} keyExtractor={function (item, index) { return "" + index; }} getItemLayout={this.getItemLayout} initialNumToRender={this.state.initialNumToRender} onViewableItemsChanged={this.onViewableItemsChanged}/>
        <AlphabetListView ref={function (ref) {
            _this.alphabetList = ref;
        }} topPosition={this.props.headerHeight} pageY={this.state.pageY + this.props.headerHeight} contentHeight={this.state.containerHeight - this.props.headerHeight} titles={this.state.titles} onSelect={this.onSelect} alphabetToast={this.props.alphabetToast}/>
      </View>);
    };
    AlphabetFlatList.defaultProps = defaultProps;
    return AlphabetFlatList;
}(Component));
export default AlphabetFlatList;
