import React from 'react'
import { Layout, Typography } from 'antd'
import { ShopOutlined } from '@ant-design/icons'

const { Header } = Layout
const { Title } = Typography

const AppHeader: React.FC = () => {
  return (
    <Header style={{ 
      display: 'flex', 
      alignItems: 'center', 
      background: '#722ed1',
      padding: '0 24px'
    }}>
      <ShopOutlined style={{ fontSize: 28, color: '#fff', marginRight: 12 }} />
      <Title level={3} style={{ color: '#fff', margin: 0 }}>
        大巴扎助手
      </Title>
      <span style={{ color: 'rgba(255,255,255,0.7)', marginLeft: 12 }}>
        The Bazaar Assistant
      </span>
    </Header>
  )
}

export default AppHeader
