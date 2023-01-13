import React from "react";
import { Dimensions, ScrollView, TouchableOpacity, View } from "react-native";

import {
  Scene,
  PerspectiveCamera,
} from "three";

import { Feather } from '@expo/vector-icons';
import { Renderer } from "expo-three";
import { GLView } from "expo-gl";
import { matrix, alternator, pipe, createMap, start } from "./FactoryObjects";
import Card from "./components/card";

const App = () => {
  var zoom = 0.4
  var camera, scene;
  var selected;
  var pointer = new THREE.Vector2();
  var group = new THREE.Group();

  function select(mode) {
    pointer.x = (mode.nativeEvent.locationX / Dimensions.get("screen").width) * 2 - 1;
    pointer.y = - (mode.nativeEvent.locationY / ((Dimensions.get("screen").height / 100) * 75)) * 2 + 1;

    let raycaster = new THREE.Raycaster();

    raycaster.setFromCamera(pointer, camera);

    let intersects = raycaster.intersectObjects(matrix.blockList);

    for (let i = 0; i < intersects.length; i++)
      selected = intersects[i].object;
  }

  function drag(mode) {
    if (selected) {
      const dragRaycaster = new THREE.Raycaster();

      var dragPointer = new THREE.Vector2();

      dragPointer.x = (mode.nativeEvent.locationX / Dimensions.get("screen").width) * 2 - 1;
      dragPointer.y = - (mode.nativeEvent.locationY / ((Dimensions.get("screen").height / 100) * 75)) * 2 + 1;

      dragRaycaster.setFromCamera(dragPointer, camera);

      const dragIntersects = dragRaycaster.intersectObjects(matrix.map);

      for (let i = 0; i < dragIntersects.length; i++) {
        var axis = new THREE.Vector3(dragIntersects[i].object.position.x, 1, dragIntersects[i].object.position.z)
        if (!matrix.get(axis.x, axis.z)) {
          if (selected.group) {
            matrix.set(selected.group.position.x, selected.group.position.z, null);
            selected.group.position.set(axis.x, axis.y, axis.z);
            matrix.set(axis.x, axis.z, selected.group);
          } else {
            matrix.set(selected.position.x, selected.position.z, null);
            selected.position.set(axis.x, axis.y, axis.z);
            matrix.set(axis.x, axis.z, selected);
          }
        }
      }
    } else {
      if ((pointer.x - ((mode.nativeEvent.locationX / Dimensions.get("screen").width) * 2 - 1)) > 0) {
        group.rotation.y += 0.03;
      } else {
        group.rotation.y -= 0.03;
      }
    }
  }

  const onContextCreate = async (gl) => {
    scene = new Scene();
    camera = new PerspectiveCamera(75, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000);
    gl.canvas = { width: gl.drawingBufferWidth, height: gl.drawingBufferHeight };

    const renderer = new Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const light = new THREE.DirectionalLight(0xAFAFAF, 1);
    light.position.set(0, 40, 0);
    light.castShadow = true;
    scene.add(light);

    var ambientLight = new THREE.HemisphereLight(0xF0F0F0);
    scene.add(ambientLight);

    var map = createMap(scene);

    start(scene, { x: 0, y: 1, z: 0 });
    alternator(scene, { x: 1, y: 1, z: 1 });
    alternator(scene, { x: 2, y: 1, z: 2 });
    alternator(scene, { x: 3, y: 1, z: 3 });
    alternator(scene, { x: 4, y: 1, z: 4 });

    group.add(camera);
    const render = () => {
      camera.position.set(map.size * zoom, map.size * zoom, map.size * zoom);
      camera.lookAt(scene.position);
      requestAnimationFrame(render);
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };

    render();
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#003B6F'
      }}
    >
      <GLView
        onTouchMove={(e) => drag(e)}
        onTouchStart={(e) => select(e)}
        onTouchEnd={() => selected = undefined}
        onContextCreate={onContextCreate}
        style={{ width: '100%', height: '80%' }}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          padding: 10,
          position: 'absolute',
          bottom: '20%',
          right: 0
        }}
      >
        <TouchableOpacity
          onPress={() => zoom -= 0.2}
          style={{
            backgroundColor: "#ff8a00",
            width: 50,
            height: 50,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 5,
            margin: 5,
            borderColor: 'white',
            borderWidth: 2,
            borderStyle: "solid",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.23,
            shadowRadius: 2.62,
            elevation: 4,
          }}
        >
          <Feather name="zoom-in" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => zoom += 0.2}
          style={{
            backgroundColor: "#ff8a00",
            width: 50,
            height: 50,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 5,
            margin: 5,
            borderColor: 'white',
            borderWidth: 2,
            borderStyle: "solid",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.23,
            shadowRadius: 2.62,
            elevation: 4,
          }}
        >
          <Feather name="zoom-out" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <ScrollView
        style={{
          width: '100%',
          height: '20%',
          backgroundColor: 'teal',
          display: "flex",
          padding: 10,
          borderColor: 'white',
          borderTopWidth: 2,
          borderStyle: "solid",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.23,
          shadowRadius: 2.62,
          elevation: 4
        }}
        horizontal={true}
      >
        <Card render={start}></Card>
        <Card render={pipe}></Card>
        <Card render={alternator}></Card>
      </ScrollView>
    </View>
  );
};

export default App;