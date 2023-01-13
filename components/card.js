import React, { useRef } from "react";
import { Dimensions, ScrollView, View } from "react-native";
import {
    Scene,
    Mesh,
    PerspectiveCamera,
    BoxGeometry,
    MeshPhongMaterial,
} from "three";
import ExpoTHREE, { Renderer } from "expo-three";
import { ExpoWebGLRenderingContext, GLView } from "expo-gl";
import { StatusBar } from "expo-status-bar";

const Card = (props) => {
    var camera, scene;

    const onContextCreate = async (gl) => {

        scene = new Scene();
        camera = new PerspectiveCamera(75, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000);
        gl.canvas = { width: gl.drawingBufferWidth, height: gl.drawingBufferHeight };
        const renderer = new Renderer({ gl });
        renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
        renderer.setClearColor(0xFF8800)

        var object = props.render(scene, { x: 1, y: 1, z: 1 }, false)

        const light = new THREE.SpotLight(0xFFFFFFFF, 3, 200);
        light.position.set(10, 40, 10)
        scene.add(light)
        const ambient = new THREE.AmbientLight(0x202020);
        scene.add(ambient)

        camera.position.set(2, 2, 2);
        camera.lookAt(scene.position);

        const render = () => {
            object.cube.rotation.y += 0.02;
            requestAnimationFrame(render);
            renderer.render(scene, camera);
            gl.endFrameEXP();
        };
        render();
    };

    return (
        <View
            style={{
                width: 140,
                height: '90%',
                alignSelf: "center",
                marginRight: 10,
                borderRadius: 5,
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
                borderRadius: 10,
                overflow: "hidden",
            }}
        >
            <GLView
                onContextCreate={onContextCreate}
                style={{
                    width: "100%",
                    height: "100%",
                }}
            />
        </View>
    );
};

export default Card;