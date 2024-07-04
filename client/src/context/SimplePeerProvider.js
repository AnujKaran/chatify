import Peer from 'simple-peer'
const { createContext, useState, useContext } = require("react");
const SimplePeerContext = createContext()
const useSimplePeer = ()=>useContext(SimplePeerContext)

const SimplePeerProvider = ({children})=>{
    const [simplePeer,setSimplePeer] = useState(null)

    const createInitiator = async(stream)=>{
      
          setSimplePeer( await new Peer({
            initiator: true,
            trickle: false,
            config: {
                iceServers: [
                    {
                        urls: ["stun:stun.l.google.com:19302"],
                    },
                ],
            },
            stream: stream,
        }))
    }

    const createReceiver = async(stream)=>{
          
          setSimplePeer( await new Peer({
            initiator: false,
            trickle: false,
            stream: stream,
          }))
          
    }

    return <SimplePeerContext.Provider value={{simplePeer,createInitiator,createReceiver}}>
        {children}
    </SimplePeerContext.Provider>
}
export { SimplePeerProvider,useSimplePeer}