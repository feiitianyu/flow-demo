import { useState, useRef, useCallback, useMemo } from 'react'
import { Divider } from 'antd'
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Handle,
  Position
} from 'reactflow'
import 'reactflow/dist/style.css'
import './App.css'
import email from './meida/icons/email.png'
import sms from './meida/icons/sms.png'
import inapp from './meida/icons/inapp.png'
import wait from './meida/icons/wait.png'
import yn from './meida/icons/yn.png'
import ab from './meida/icons/ab.png'

const types = [
  {
    theme: 'Messages',
    items: [
      { icon: email, title: 'Email', key: 'email' },
      { icon: sms, title: 'SMS', key: 'sms' },
      { icon: inapp, title: 'in-app', key: 'inapp' }
    ]
  },
  {
    theme: 'Delay',
    items: [
      { icon: wait, title: 'Wait', key: 'wait' }
    ]
  },
  {
    theme: 'Filters and flow',
    items: [
      { icon: yn, title: 'Yes/no split', key: 'ys' },
      { icon: ab, title: 'A/B split', key: 'ab' },
    ]
  }
]

const EmailNode = () => {
  return (
    <>
    <Handle type='target' position={Position.Top} className='custom-top-handle' />
    <div className='node'>
      <div style={{ display: 'flex', fontSize: 12 }}>
        <img src={email} width={35} />
        <div>
          <div>Email</div>
          <div>Re-Engagement Offers</div>
        </div>
      </div>
      <Divider />
      <div style={{ fontSize: 12, color: 'gray' }}>
        <div>Total send: --</div>
        <div>Delivery rate: --</div>
        <div>Open rate: --</div>
        <div>Click rate: --</div>
      </div>
    </div>
    <Handle type='source' position={Position.Bottom} className='custom-bottom-handle' />
    </>
  )
}

const SmsNode = () => {
  return (
    <>
    <Handle type='target' position={Position.Top} className='custom-top-handle' />
    <div className='node'>
      <div style={{ display: 'flex', fontSize: 12 }}>
        <img src={sms} width={35} />
        <div>
          <div>SMS</div>
          <div>Delivery rate: --</div>
        </div>
      </div>
      <Divider />
      <div style={{ fontSize: 12, color: 'gray' }}>
        <div>Total sent: --</div>
        <div>Total clicks: --</div>
      </div>
    </div>
    <Handle type='source' position={Position.Bottom} className='custom-bottom-handle' />
    </>
  )
}

const InAppNode = () => {
  return (
    <>
    <Handle type='target' position={Position.Top} className='custom-top-handle' />
    <div className='node'>
      <div style={{ display: 'flex', fontSize: 12 }}>
        <img src={inapp} width={35} />
        <div>
          <div>In-app</div>
          <div>New Offers Details</div>
        </div>
      </div>
      <Divider />
      <div style={{ fontSize: 12, color: 'gray' }}>
        <div>Total sent: --</div>
        <div>Total clicks: --</div>
      </div>
    </div>
    <Handle type='source' position={Position.Bottom} className='custom-bottom-handle' />
    </>
  )
}

const WaitNode = () => {
  return (
    <>
    <Handle type='target' position={Position.Top} className='custom-top-handle' />
    <div className='node'>
      <div style={{ display: 'flex', fontSize: 12 }}>
        <img src={wait} width={35} />
        <div>
          <div>Wait</div>
          <div>3 days,0 hours,0 minutes</div>
        </div>
      </div>
    </div>
    <Handle type='source' position={Position.Bottom} className='custom-bottom-handle' />
    </>
  )
}

const YsNode = () => {
  return (
    <>
    <Handle type='target' position={Position.Top} className='custom-top-handle' />
    <div className='node'>
      <div style={{ display: 'flex', fontSize: 12 }}>
        <img src={yn} width={35} />
        <div>
          <div>Test Channels</div>
        </div>
      </div>
    </div>
    <Handle type='source' position={Position.Bottom} className='custom-bottom-handle custom-bottom-handle-25' id='1' />
    <Handle type='source' position={Position.Bottom} className='custom-bottom-handle custom-bottom-handle-75' id='2' />
    </>
  )
}

const AbNode = () => {
  return (
    <>
    <Handle type='target' position={Position.Top} className='custom-top-handle' />
    <div className='node'>
      <div style={{ display: 'flex', fontSize: 12 }}>
        <img src={ab} width={35} />
        <div>
          <div>Send to journey</div>
          <div>{'[FakeFlights] Nurture'}</div>
        </div>
      </div>
    </div>
    <Handle type='source' position={Position.Bottom} className='custom-bottom-handle custom-bottom-handle-25' id='1' />
    <Handle type='source' position={Position.Bottom} className='custom-bottom-handle custom-bottom-handle-75' id='2' />
    </>
  )
}

let id = 0;
const getId = () => `dndnode_${id++}`;

function App() {
  const reactFlowWrapper = useRef(null)
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [reactFlowInstance, setReactFlowInstance] = useState(null)
  const nodeTypes = useMemo(() => ({
    email: EmailNode,
    sms: SmsNode,
    inapp: InAppNode,
    wait: WaitNode,
    ys: YsNode,
    ab: AbNode
  }), [])

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  )

  const onDragOver = useCallback((event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event) => {
      event.preventDefault()
      const type = event.dataTransfer.getData('application/reactflow')
      if(typeof type === undefined || !type) {
        return
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY
      })

      const newNodes = {
        id: getId(),
        type,
        position
      }

      setNodes((nds) => nds.concat(newNodes))
    },
    [reactFlowInstance]
  )

  const onDrapStart = useCallback((event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }, [])

  return (
    <div className='dndflow'>
      <ReactFlowProvider>
        <div className='reactflow-wrapper' ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            defaultEdgeOptions={{ markerEnd: { type: 'arrowclosed' } }}
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
        <div style={{ width: 250, borderLeft: '1px solid #E8E8E8', padding: 12 }}>
          {
            types.map(t => (
              <div style={{ marginBottom: 12 }} key={t.theme}>
                <div style={{ marginBottom: 12, fontSize: 15 }}>{t.theme}</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                  {
                    t.items.map(i => (
                      <div
                        key={i.title}
                        onDragStart={(event) => onDrapStart(event, i.key)}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          border: '2px solid #E8E8E8',
                          aspectRatio: '4/3',
                          borderRadius: 12,
                          cursor: 'grab'
                        }}
                        draggable
                      >
                        <img src={i.icon} width='35' />
                        <div style={{ fontSize: 14 }}>{i.title}</div>
                      </div>
                    ))
                  }
                </div>
              </div>
            ))
          }
        </div>
      </ReactFlowProvider>
    </div>
  )
}

export default App
