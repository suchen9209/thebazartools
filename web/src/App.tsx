import type { FC } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from 'antd'
import AppHeader from './components/Layout/AppHeader'
import AppSidebar from './components/Layout/AppSidebar'
import Home from './pages/Home'
import Items from './pages/Items'
import Shops from './pages/Shops'
import Builds from './pages/Builds'
import Calculator from './pages/Calculator'
import Matches from './pages/Matches'
import './App.css'

const { Content } = Layout

const App: FC = () => {
  return (
    <BrowserRouter>
      <Layout style={{ minHeight: '100vh' }}>
        <AppHeader />
        <Layout>
          <AppSidebar />
          <Layout style={{ padding: '24px' }}>
            <Content className="app-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/items" element={<Items />} />
                <Route path="/shops" element={<Shops />} />
                <Route path="/builds" element={<Builds />} />
                <Route path="/calculator" element={<Calculator />} />
                <Route path="/matches" element={<Matches />} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </BrowserRouter>
  )
}

export default App

