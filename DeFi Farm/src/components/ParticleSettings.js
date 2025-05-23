import React from 'react';
import Particles from 'react-tsparticles';

const ParticleSettings = () => {
    return (
        <div>
            <Particles
            height='1000px'
            width='100vw'
            id='tsparticles'
            options={{
                fullScreen: {
                    enable: true,
                },
                background:{
                    color:{
                        value:"#0d47a1"
                    },
                },
                fpslimit:30,
                interactivity:{
                    detect_on:'canvas',
                    events:{
                        onClick:{
                            enable:'true',
                            mode:'push'
                        },
                        onHover:{
                            enable:'true',
                            mode:'repulse'
                        },
                        resize: 'true',
                    },
                    modes: {
                        bubble:{
                            distance:400,
                            duration:2,
                            opacity:0.8,
                            size:40,
                        },
                        push:{
                            quantity:4,
                        },
                        repulse:{
                            distance:100,
                            duration:0.4,
                        },
                    },
                },
                particles:{
                    color:{
                        value:"#ffffff",
                    },
                    links:{
                        color:"#ffffff",
                        distance:150,
                        enable:true,
                        opacity:0.5,
                        width:1,
                    },
                    collisions:{
                        enable:true,
                    },
                    move:{
                        direction:"none",
                        enable:true,
                        outMode:"bounce",
                        random:false,
                        speed:1,
                        straight:false,
                    },
                    number:{
                        density:{
                            enable:true,
                            value_area:800,
                        },
                        value:80,
                    },
                    opacity:{
                        value:0.5,
                    },
                    shape:{
                        type:"circle",
                    },
                    size:{
                        random:true,
                        value:5,
                    },
                    
                }
            }}
            />
        </div>
    )
}
export default ParticleSettings;
