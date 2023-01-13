import {
    Mesh,
    BoxGeometry,
    MeshPhongMaterial,
    Group,
} from "three";
import { mergeBufferGeometries } from "../services/BufferGeometryUtils";

export default function _lampBlock(position, scene) {
    let geometry = [
        new mergeBufferGeometries([
            new BoxGeometry(0.1, 0.4, 0.4).translate(-0.45, 0, 0),
            new BoxGeometry(0.1, 0.32, 0.32).translate(-0.40, 0, 0),
            new BoxGeometry(0.4, 0.15, 0.15).translate(-0.20, 0, 0)
        ]),
        new mergeBufferGeometries([
            new BoxGeometry(0.55, 0.55, 0.55),
            new BoxGeometry(0.42, 0.65, 0.42),
            new BoxGeometry(0.42, 0.42, 0.65),
            new BoxGeometry(0.65, 0.42, 0.42),
            new BoxGeometry(0.30, 0.30, 0.30).translate(-0.3, 0, 0),
        ]),
        new mergeBufferGeometries([
            new BoxGeometry(0.2, 0.2, 0.2).translate(-0.45, 0, 0)
        ])
    ];

    let material = [
        new MeshPhongMaterial({
            color: 0x272727,
        }),
        new MeshPhongMaterial({
            color: 0x63D0DF,
            transparent: true,
            opacity: 0.6
        }),
        new MeshPhongMaterial({
            color: "green",
        })
    ];

    let mesh = [
        new Mesh(geometry[0], material[0]),
        new Mesh(geometry[1], material[1]),
        new Mesh(geometry[2], material[2])
    ]

    let cube = new Group();

    cube.translateOnAxis(position.x, position.y, position.z);

    cube.action = function (energy) {
        if (energy) {
            mesh[1].material = new MeshPhongMaterial({
                color: 0x00FF66,
                transparent: true,
                opacity: 0.9
            })
            mesh[0].castShadow = false;
        } else {
            mesh[1].material = material[1];
            mesh[0].castShadow = true;
        };
    }

    cube.add(mesh[0])
    cube.add(mesh[1])
    cube.add(mesh[2])

    mesh.map((a) => {
        a.receiveShadow = true;
        a.castShadow = true;
        a.group = cube;
        a.action = cube.action;
        a.position.set = (x, y, z) => {
            cube.position.set(x, 1, z)
        }
        return a;
    })
    mesh[1].castShadow = false;
    return cube;
}