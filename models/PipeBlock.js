import {
    Mesh,
    BoxGeometry,
    MeshPhongMaterial,
    Group,
} from "three";
import { mergeBufferGeometries } from "../services/BufferGeometryUtils";

export default function _pipeBlock(position){
    let geometry = [
    new mergeBufferGeometries([
        new BoxGeometry(1, 0.4, 0.4),
    ]),
    new mergeBufferGeometries([
        new BoxGeometry(1.2, 0.2, 0.2),
    ])];

    let material = [
        new MeshPhongMaterial({
            color: 0x272727,
        }),
        new MeshPhongMaterial({
            color: "green",
        })
    ];

    let mesh = [
        new Mesh(geometry[0], material[0]),
        new Mesh(geometry[1], material[1])
    ]

    let cube = new Group();

    cube.translateOnAxis(position.x, position.y, position.z);
    cube.action = (energy) => {
        if (energy) {
            cube.energy = true;
        } else {
            cube.energy = false;
        };
    }
    
    cube.add(mesh[0])
    cube.add(mesh[1])

    mesh.map((a)=>{
        a.receiveShadow = true;
        a.castShadow = true;
        a.group = cube;
        a.action = cube.action;
        a.position.set = (x, y, z) => {
            cube.position.set(x, 1, z)
        }
        return a;
    })
    return cube;
}