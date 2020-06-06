import React from 'react'

import App from './App'

import { injectElementsList } from './libs/utils/injectReact'

import './styles/index.sass'


injectElementsList([
  {
    id: "three-root",
    component: <App />
  },
])
