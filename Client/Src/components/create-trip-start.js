'use strict';

import React, {
  StyleSheet,
  Component,
  View,
  Dimensions,
  Text,
  Alert,
  Image,
  Navigator,
  AsyncStorage,
  TouchableOpacity
} from 'react-native';

import { getCurrentPosition, watchPosition } from '../helpers/geolocation';
import { submitStart, submitEnd } from '../helpers/submitStates';
import { setMarkers } from '../helpers/setMarker';
import MapView from 'react-native-maps';
import AutoComplete from '../Common/AutoComplete';
import Button from '../Common/Button';
import ETA from '../Common/eta-confirmation';
import PopUpAlert from '../Common/popUp-confirmation';
import SlideUp from './slide-up';
import NavBar from './nav-bar';
import Timer from '../Common/timer-overlay';

const styles = StyleSheet.create(require('../styles.js'));
import { baseStyles } from '../styles-base';
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;

export default class MapStart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: 'setStart',
      description: 'Confirm Start',
      markers: [],
      region: {
        latitude: this.props.route.currentLocation.coords.latitude,
        longitude:this.props.route.currentLocation.coords.longitude,
        latitudeDelta: .2,
        longitudeDelta: .2 / ASPECT_RATIO
      },
      show: true,
      inRange: false,
      checkedIn: false,
      startPoint: null,
      endPoint: null,
    }
  }
  onRegionChange = (region) => {
    this.setState({ region: region });
  };
  componentDidMount() {
    setTimeout(() => {
      if(this.props.state.user.password === ''){
        this.props.navigator.push({name: 'passcodeSet'});
      }
    }, 300);
    ///////////////////////////////////////////////////////
    // THIS CALL TO ASYNC STORAGE NEEDS TO BE DELETED
    // IT IS BEING USED FOR CLEARING AN ACTIVE TRIP WHILE TESTING PASSCODE.
    // AsyncStorage.multiSet([
    //   ['onTrip', JSON.stringify('false')],
    //   ['activeTrip', JSON.stringify(null)],
    //   ['password', JSON.stringify('')]
    //   ]);
    ///////////////////////////////////////////////////////
    if (this.props.state.activeTrip.stage === 'tracking'){
      const { stage, markers, origin, destination} = this.props.state.activeTrip;
      this.setState({
        stage,
        markers,
        startPoint: origin,
        endPoint: destination,
        show: false,
        description: 'Tracking'
      });
    }
  }
  changeRegion = (location) => {
    this.setState({region: {
      latitude: location.latitude,
      longitude:location.longitude,
      latitudeDelta: .005,
      longitudeDelta: .005 / ASPECT_RATIO}});
  };
  //snaps view to location sets markers on start and end also adjust for marker changes before submit.
  // setMarker = (location, state) => {
  //   setMarkers(location, this, state);
  //   //setMarkers(location, this);
  // };
  
  checkingIn = () => {
    this.props.navigator.push({name: 'passcodeConfirm'});
    // actions.checkIn(state.user.id);
    // These need to be read from redux state.
    this.setState({checkedIn: true, inRange: false});
  };

//handles the submit button being pressed and saves location as start then changes state to next save end
  submit = () => {
    if(this.state.stage === 'setStart'){
      submitStart(this);
    }else if(this.state.stage === 'setEnd'){
      submitEnd(this)
    }
  };

  render() {

    const { state, actions, navigator } = this.props;
    const { currentLocation, user } = state; //destructure the parts of state that you need
    const { getCurrentLocation, addMarker } = actions; // destructure the actions the components uses to update state.
    const { activeTrip } = this.props.state

    // var button = this.state.show ? <Button ref='button' style={styles.ButtonContainer} text={this.state.description} onPress={this.submit}></Button> : null;
    //console.log("state: ", state);

    var checkIn = state.activeTrip.inRange ?
    <PopUpAlert elementText={"We have detected that you are close to your destination"}
        buttonText={"I'm safe!"}
        onPress={()=>{
          actions.checkIn(state.user.id)
        }}
    /> : null;

    var autocomplete = !state.user.onTrip ?
      <View style={[baseStyles.component, styles.autoComplete]}>
        <AutoComplete ref='auto'
          selectPoint={(input)=>{this.changeRegion(input);
            this.setMarker(input);}}
        />
      </View> : null;

    var eta = (state.activeTrip.markers.length > 0 && !state.user.onTrip) ?// === 'eta' ?
      <ETA startTrip={(payload)=> {
          actions.startTrip(payload);
          this.setState({
            stage:'tracking',
            description: 'Currently Tracking your Location'
          });
          watchPosition(this, this.props.state.user);
        }}
        tripState={state.activeTrip}
        userId={state.user.id}
        acceptableDelay={state.user.acceptableDelay}
        >
      </ETA> : null;

    var destination = state.activeTrip.markers.length > 0 ? 
      <MapView.Marker
        key={state.activeTrip.markers[1].key}
        coordinate={state.activeTrip.markers[1].coordinate}
        ref={state.activeTrip.markers[1].id}
        title={state.activeTrip.markers[1].id}
        onDragEnd={(e) => {addMarker(e.nativeEvent.coordinate)}}
        draggable>
        {callout}
      </MapView.Marker>
    : null;

    var callout = this.state.show ?
      <MapView.Callout>
        <TouchableOpacity onPress={()=> {this.submit();}}>
          <Text>Press to Confirm</Text>
        </TouchableOpacity>
      </MapView.Callout> :
      <MapView.Callout>
        <Text></Text>
      </MapView.Callout>;

    var timer = state.user.onTrip ?
    <Timer
      state = {activeTrip}>
    </Timer> : null;

          // {state.activeTrip.markers.map(marker => (
          //   <MapView.Marker
          //     key={marker.key}
          //     coordinate={marker.coordinate}
          //     ref={marker.id}
          //     title={marker.id}
          //     onDragEnd={(e) => {this.setMarker(e.nativeEvent.coordinate, state)}}
          //     draggable>
          //     {callout}
          //   </MapView.Marker>
          // ))}
    return (
      <View style={baseStyles.navContainer}>
      <View style={[baseStyles.container]}>
        <MapView
          style={baseStyles.container}
          showsUserLocation={true}
          region={this.state.region}
          onRegionChange={this.onRegionChange}
          onLongPress={(e) => {addMarker(e.nativeEvent.coordinate)}}
          onPress={()=> {if(this.state.show){this.refs.auto.refs.Auto.setState({listViewDisplayed: false}); this.refs.auto.refs.Auto.triggerBlur();}}}
        >
          { destination }
        </MapView>

        <NavBar
          navigator={navigator}
          description={this.state.description}
          right={{
            image: 'gear',
            action: () => navigator.push({
              name: 'settings'
            })
          }}
          left={{
            image: 'shield',
            action: () => navigator.push({
              name: 'settings',
              sceneConfig: 'FloatFromLeft'
            })
          }}
          />

        <View style={[baseStyles.component]}>
          {autocomplete}
        </View>

        {eta}

        {timer}

        {checkIn}




        <SlideUp
          navigator={navigator}
          nextScene='guardian'
          label='Guardian'
          />

      </View>
      </View>
    );
  }

};

// var checkedIn = this.state.checkedIn ?
//   <PopUpAlert elementText={"Thanks for letting us know that you've made it to your destination, " + state.user.name}
//     buttonText={"End Trip"} /> : null;
