import { Box, ButtonBase, Card, Divider, Link, Typography } from "@mui/material"
import axios from "axios"
import { useContext, useEffect, useRef, useState, type JSX } from "react"
import type { Form, FormEdge, FormNode } from "../i_forms"
import { PrefillEditor } from "./PrefillEditor"
import { DataMapper } from "./DataMapper"
import FeedIcon from '@mui/icons-material/Feed'
import { FormContext, type BlueprintContext } from "./helpers/Context"

export const RootFormView = (): JSX.Element => {
  // constants
  const BASE_URL = 'http://localhost:3000/'

  // hooks
  const [us_forms, us_setForms] = useState<Form[] | null>(null)
  const [us_showEditor, us_setShowEditor] = useState<boolean>(false)
  const [us_selectedForm, us_setSelectedForm] = useState<Form | null>(null)
  const [us_selectedNode, us_setSelectedNode] = useState<FormNode | null>(null)
  const [us_nodes, us_setNodes] = useState<FormNode[] | null>(null)
  const [us_edges, us_setEdges] = useState<FormEdge[] | null>(null)
  const [us_showDataMapper, us_setShowDataMapper] = useState<boolean>(false)
  const [us_selectedField, us_setSelectedField] = useState<string>('')
  const ur_canvasRef = useRef<HTMLCanvasElement>(null)

  const { FORM_CONTEXT: uc_formContext, SET_FORM_CONTEXT: uc_setFormContext } = useContext(FormContext)

  useEffect(() => {
    // this will request the form data each time the page is rendered
    const getFormData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}api/v1/123/actions/blueprints/bp_456/graph`, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
  
        if (!res.data) {
          console.error('No data found for form request')
        }
  
        if (!res.data.forms) {
          console.error('No forms found on data object')
        }

        if (!res.data.nodes) {
          console.error('No nodes found on data object')
        }

        if (!res.data.edges) {
          console.error('No edges found on data object')
        }
  
        return res.data
      } catch (err) {
        console.error(err)
      }
    }
    
    try {
      // put the form data in state and update the context
      getFormData().then((res) => {
        if (!res) {
          console.error('Failed to get data from API')
          return
        }

        us_setForms(res.forms)
        orderNodes(res.nodes)
        us_setNodes(res.nodes)
        us_setEdges(res.edges)
  
        // update the app context
        updateEmptyContext(res.forms, res.nodes)
      })
    } catch (err) {
      console.error(err)
    }
  }, [])

  useEffect(() => {
    if (us_edges && us_nodes) {
      displayEdges(us_edges, us_nodes)
    }
  }, [us_edges])

  // methods
  const updateContext = (form: Form | null, node: FormNode | null, prefill: boolean | null, key: string | null, fullContextObject: BlueprintContext | null = null) => {
    if (fullContextObject) {
      uc_setFormContext(fullContextObject)
      return
    }

    if (form && node && prefill && key) {
        uc_setFormContext({
          ...uc_formContext,
          [key]: {
            key,
            form,
            node,
            prefill
          },
        })
    }
  }

  // this will be used on the initial load of the root component, should put all forms/nodes into the context
  const updateEmptyContext = (forms: Form[], nodes: FormNode[]) => {
    const contextObject: BlueprintContext = {}

    for (const node of nodes) {
      const key = node.data.name
      const form = forms.find((form) => node.data.component_id === form.id)

      if (form && node) {
        contextObject[key] = {
          key,
          form,
          node,
          prefill: false
        }
      } else {
        if (!form) {
          console.error('Form data is missing when trying to update context')
        } else {
          console.error('Node data is missing when trying to update context')
        }
        return
      }
    }

    updateContext(null, null, null, null, contextObject)
  }

  const orderNodes = (nodes: FormNode[]): void => {
    nodes.sort((a: FormNode, b: FormNode) => a.position.x - b.position.x)
    us_setNodes(nodes)
  }

  const getFormById = (id: string): Form | undefined => {
    if (!us_forms) {
      return undefined
    }

    return us_forms.find((form: Form) => id === form.id)
  }

  // display the form mapping interface when a form is clicked
  const handleNodeClick = (node: FormNode) => {
    // set the selected form so it can be passed as a prop into the editor component
    const form = getFormById(node.data.component_id)

    if (form) {
      us_setSelectedForm(form)
      us_setSelectedNode(node)
    }

    // show the editor component to edit the mappings
    us_setShowEditor(!us_showEditor)
  }

  // display an individual form, called by displayNodes
  const displayNode = (node: FormNode): JSX.Element => {
    const leftPosition = node.position.x
    const topPosition = node.position.y
    return (
      <ButtonBase key={node.id} onClick={() => {handleNodeClick(node)}} sx={{position:'absolute', left: -30}}>
        <Card sx={{position: 'relative', left: leftPosition, top: topPosition, height: '50px', width: '110px', padding: '5px'}}>
            <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center'}}>
              <FeedIcon sx={{color: 'purple', marginTop: '10px'}}/>
              <Typography variant='h6' sx={{marginTop: '10px'}}>{node.data.name}</Typography>
            </Box>
        </Card>
      </ButtonBase>
    )
  }

  // display all forms
  const displayNodes = (nodes: FormNode[]): JSX.Element => {
    return (
      <Box sx={{position: 'absolute', left: -100, width: '100%', height: '100%'}}>
        {nodes.map((node: FormNode) => {
          return displayNode(node)
        })}
      </Box>
    )
  }

  const displayEdges = (edges: FormEdge[], nodes: FormNode[]): void => {
    // dynamically assign the width and height to canvas
    const canvasElement = ur_canvasRef.current

    if (canvasElement) {
      const ctx = canvasElement.getContext("2d")
      canvasElement.width = canvasElement.clientWidth
      canvasElement.height = canvasElement.clientHeight
      
      if (ctx) {
        edges.map((edge: FormEdge) => {
        displayEdge(edge, nodes, ctx)
        })
      }
    }
  }

  const displayEdge = (edge: FormEdge, nodes: FormNode[], ctx: CanvasRenderingContext2D): void => {
    drawLine(edge, { color: 'text.tertiary', width: 2 }, nodes, ctx)
  }

  // borrowed and modified from: https://stackblitz.com/edit/draw-line-canvas-react?file=index.js
  const drawLine = (edge: FormEdge, style: { color: string, width: number }, nodes: FormNode[], ctx: CanvasRenderingContext2D) => {
    const sourceNode = nodes.find((node: FormNode) => node.data.component_key === edge.source)
    const targetNode = nodes.find((node: FormNode) => node.data.component_key === edge.target)
    const sourceX = sourceNode?.position.x
    const sourceY = sourceNode?.position.y
    const targetX = targetNode?.position.x
    const targetY = targetNode?.position.y

    console.log('drawing line', ctx)

    if (ctx && sourceX && sourceY && targetX && targetY) {
      ctx.beginPath()
      ctx.moveTo(sourceX, sourceY)
      ctx.lineTo(targetX, targetY)
      ctx.strokeStyle = style.color
      ctx.lineWidth = style.width
      ctx.stroke()
    }
  }

  // JSX
  return (
    <Box data-testid="root-form-view" sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw', backgroundColor: '#ffffff'}}>
      <Box sx={{position: 'absolute', flexDirection: 'column', zIndex: 1}}>
        <Typography>Brady Richardson</Typography>
        <Divider />
        <Link href={'https://www.linkedin.com/in/brady-r-richardson/'} target='_blank'>LinkedIn</Link>
        <Divider />
        <Link href={'https://github.com/bradyrichardson'} target='_blank'>Github</Link>
        <Divider />
        <Link href={'https://bradyrichardson.github.io/'} target="_blank">Portfolio</Link>
      </Box>
      <canvas
        ref={ur_canvasRef}
        style={{
          position: 'absolute',
          top: 30,
          left: -50,
          zIndex: 0,
          pointerEvents: 'none',
        }}
        width={window.innerWidth}
        height={window.innerHeight}
      />
      {us_forms && us_forms.length > 0 && us_nodes && displayNodes(us_nodes)}
      {}
      {us_showEditor && us_selectedForm && us_selectedNode ?
        <PrefillEditor selectedNode={us_selectedNode} selectedForm={us_selectedForm} setters={{us_setShowDataMapper, us_setShowEditor, us_setSelectedField}}/> : <></>
      }
      {us_showDataMapper && us_selectedNode && us_forms && us_nodes && us_selectedForm ?
        <DataMapper selectedNode={us_selectedNode} selectedForm={us_selectedForm} nodes={us_nodes} forms={us_forms} setters={{ us_setShowDataMapper, us_setShowEditor }} selectedField={us_selectedField}/> : <></>
      }
    </Box>
  )
}