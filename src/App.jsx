import { useState, useEffect } from 'react'

import { BsFillPersonFill } from 'react-icons/bs'
import { IoSendSharp } from 'react-icons/io5'

import io from 'socket.io-client'

const socket = io("ws://127.0.0.1:3333", {
  reconnectionDelayMax: 10000
})

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [connection_id, setConnectionID] = useState(socket.id)
  const [messageWS, setMessageWs] = useState('')
  const [all_messages, setAllMessages] = useState([])

  const colorStatus = isConnected ? 'text-green-600' : 'text-red-600'
  const colorPulse = isConnected ? 'bg-green-600' : 'bg-red-600'

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
      setConnectionID(socket.id)
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('chat', (data) => {
      console.log(data.chat);
    })
    // get_new_messages()
    socket.on('getMessages', (data) => {
      // console.log(data);
      if (data.message) {
        // setAllMessages(all_messages.push(data))
        all_messages.push(data)      
        console.log('esse é o all: ',all_messages);
      }
      listMessages()
    })    

    
  }, [])

  const listMessages = () => {
    let new_all_messages = []
    all_messages.forEach(message => {
      new_all_messages.push(<div key={message.id}><h1>{message.id}</h1><p>{message.message}</p></div>)
      console.log('to aqui');
    });
    return new_all_messages
  }


  const handleChange = (event) => {
    if (event.target.value) {
      setMessageWs(event.target.value);      
    }
  }

  const getMessage = (event) => {    
    event.preventDefault();

    const new_message = {
      id: socket.id,
      message: messageWS
    }
    
    if (new_message.message) {
      socket.emit('sendMessages', new_message)      
      setMessageWs('')
    }
    // console.log(messageWS);
  }


  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-800">
      <h2 className='font-bold text-white'>Chat WebSocket</h2>
      {/* Div com o Corpo do Chat */}
      <div className='h-3/6 min-w-fit bg-slate-700 rounded-md drop-shadow-lg p-3'>
        {/* Cabeçalho do Chat Conexão e Status */}
        <div className='bg-slate-800 p-2 rounded-md overflow-x-hidden'>
          <h2 className='font-bold text-white ml-2'>Conexão: {connection_id}</h2>
          <h2 className='font-bold text-white ml-2'>Status:
            <b className={`ml-1 ${colorStatus} `}>
              {isConnected ? 'Conectado' : 'Desconectado'}
              <span className={`animate-ping relative mb-2 inline-flex h-1 w-1 rounded-full ${colorPulse} opacity-75`}>
              </span>
            </b>
          </h2>
        </div>
        {/* Div com conteudo do chat, Mensagens e icones */}
        <div className='mt-1 rounded-md bg-slate-800 h-3/4 min-w-full w-5 p-1'>
          {/* Div onde irá ficar as mensagens */}
          <div className='overflow-y-scroll scrollbar-thin scrollbar-thumb-slate-700 bg-slate-900 min-h-[96%] max-h-[96%] min-w-full rounded-md'>
            <div className='flex flex-col justify-end min-w-full min-h-[310px] p-3'>
              <div className='flex justify-end items-center'>
                <div className='bg-slate-800 flex items-center justify-end p-1 rounded-md drop-shadow-md'>
                  <h1 className='text-white font-sans'>Eai?</h1>
                </div>
              </div>
              <div className='grid grid-cols-2 grid-flow-row place-content-start items-center mt-4'>
                <div className='flex justify-start h-full'>
                  <div className='flex justify-center items-center w-10 h-10 rounded-full ml-[-1rem]'>
                    <BsFillPersonFill color='white' size={30} />
                  </div>
                </div>
                <div className='flex justify-start'>
                  <div className='ml-[-6.5rem] bg-slate-800 flex items-center justify-start p-1 rounded-md drop-shadow-md'>
                    {/* <h1 className='text-white font-sans'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo molestiae dolore repellendus voluptate alias adipisci dolorum quia officia enim quaerat! Tenetur corrupti suscipit facere! In est assumenda iusto reiciendis soluta.</h1> */}
                    <h1 className='text-white font-sans'>Olá!</h1>
                  </div>
                </div>
                <div>
                  {listMessages()}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Div onde irá ficar Text Field para enviar mensagem */}
        <div className='h-10 rounded-md mt-1 flex items-center justify-center'>
          <form onSubmit={getMessage}>
            <label className='flex justify-center items-center bg-slate-800 rounded-md'>
              <input value={messageWS} type="text" onChange={handleChange} placeholder="digite sua mensagem" className='bg-slate-800 border border-gray-800 text-white text-sm rounded-lg p-2.5' />
              <button type="submit" className='ml-1 h-[40px] flex justify-center items-center bg-slate-800 hover:bg-slate-900 text-white px-4 rounded-md'><IoSendSharp color='white' size={20} /></button>
            </label>
          </form>
        </div>
      </div>
    </div>
  )
}

export default App
