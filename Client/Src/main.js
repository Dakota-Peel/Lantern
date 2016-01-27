var React = require('react-native');
var {
  StyleSheet,
  Navigator
} = React;

var Signin = require('./Facebook/Signin');
var Home = require('./Home/Home');

var ROUTES = {
  signin: Signin,
  home: Home
};

/**
 * A sample app that demonstrates use of the FBSDK login button, native share dialog, and graph requests.
 */
var Main = React.createClass({
  renderScene: function(route, navigator){
    var Component = ROUTES[route.name];
    return <Component route={route} navigator={navigator}/>;
  },
  render: function() {
    return (
      <Navigator
        style={styles.navigator}
        initialRoute={{name: 'signin'}}
        renderScene={this.renderScene}
        configureScene={() => {
          return Navigator.SceneConfigs.FloatFromRight; }}
      />
    );
  }
});

// importing styles
var styles = StyleSheet.create(require('./styles.js'));

module.exports = Main;