/**
 * Created by JetBrains WebStorm.
 * Author: yoon
 * Date: 19-9-3
 * Time: 下午7:59
 * Desc:
 */
import React from "react";
import { Text, View } from "react-native";
import styles from "./styles";
export var sectionHeaderHeight = 25;
var SectionHeader = function (props) {
    return (<View style={[styles.sectionHeaderContainer, {
            height: sectionHeaderHeight
        }]}>
      <Text style={styles.sectionHeaderTitle}>
        {props.title}
      </Text>
    </View>);
};
export default SectionHeader;
