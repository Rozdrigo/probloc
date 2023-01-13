import {
    Mesh,
    BoxGeometry,
    MeshPhongMaterial,
    Group,
} from "three";
import { mergeBufferGeometries } from "../services/BufferGeometryUtils";

export default function _startBlock(){
    let geometry = [new mergeBufferGeometries([
        new BoxGeometry(0.7, 1, 0.7),
        new BoxGeometry(1, 0.2, 1).translate(0, 0.4, 0),
        new BoxGeometry(1, 0.2, 1).translate(0, -0.4, 0),
    ]),
    new mergeBufferGeometries([
        new BoxGeometry(1, 0.4, 0.4),
        new BoxGeometry(0.4, 0.4, 1),
        new BoxGeometry(0.55, 0.2, 0.55).translate(0, 0.45, 0),
    ]),
    new mergeBufferGeometries([
        new BoxGeometry(0.5, 0.2, 0.5).translate(0, 0.48, 0),
        new BoxGeometry(1.05, 0.2, 0.2),
        new BoxGeometry(0.2, 0.2, 1.05),
    ])];
    
    let material = [new MeshPhongMaterial({
        color: "red",
    }), new MeshPhongMaterial({
        color: 0x272727,
    }), new MeshPhongMaterial({
        color: "green",
    })];

    let mesh = [
        new Mesh(geometry[0], material[0]),
        new Mesh(geometry[1], material[1]),
        new Mesh(geometry[2], material[2]),
    ]

    let cube = new Group();
    cube.energy = true;
    cube.action = () => {};

    cube.add(mesh[0])
    cube.add(mesh[1])
    cube.add(mesh[2])

    mesh.map((a)=>{
        a.receiveShadow = true;
        a.castShadow = true;
        a.group = cube;
        a.action = cube.action;
        a.position.set = (x, y, z) => {
            mesh.map((b)=>{
                b.position.x = x;
                b.position.z = z;
                return b;
            })
        } 
        return a;
    })

    return cube;
}