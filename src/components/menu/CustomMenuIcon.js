import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Menu, { MenuItem, MenuDivider } from "react-native-material-menu";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

export default class CustomMenuIcon extends Component {
  _menu = null;
  setMenuRef = ref => {
    this._menu = ref;
  };
  showMenu = () => {
    this._menu.show();
  };
  hideMenu = () => {
    this._menu.hide();
  };
  optionNavigationInformationClick = () => {
    this._menu.hide();
    this.props.optionNavigationInformationClick();
  };

  optionSortListClick = () => {
    this._menu.hide();
    this.props.optionSortListClick();
  };

  optionSortGirdClick = () => {
    this._menu.hide();
    this.props.optionSortGirdClick();
  };

  render() {
    return (
      <View style={this.props.menustyle}>
        <Menu
          ref={this.setMenuRef}
          button={
            <TouchableOpacity onPress={this.showMenu}>
              <MaterialIcon name="more-vert" size={30} color="white" />
            </TouchableOpacity>
          }
        >
          <MenuItem onPress={this.optionNavigationInformationClick}>
            Giới thiệu
          </MenuItem>
          <MenuItem onPress={this.optionSortGirdClick}>
            Sắp xếp theo dạng lưới
          </MenuItem>
          <MenuItem onPress={this.optionSortListClick}>
            Sắp xếp theo danh sách
          </MenuItem>
        </Menu>
      </View>
    );
  }
}
