export const fragment = `
    uniform float time;
    varying vec3 vWorldPosition;
    void main() {
        vec3 color = vec3(
	        vWorldPosition.x + cos(time) * 0.5 + 0.5, 
	        vWorldPosition.y + sin(time) * 0.5 + 0.5,
	        vWorldPosition.z + cos(time) * 0.5 + 0.5
        );
        gl_FragColor = vec4(color, 1.0);
    }
`
