import React from 'react'
import { Layout, Menu } from 'antd'
import { 
  HomeOutlined, 
  ShoppingOutlined, 
  ShopOutlined,
  BuildOutlined,
  CalculatorOutlined,
  TrophyOutlined
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'

const { Sider } = Layout

const menuItems = [
  { key: '/', icon: <HomeOutlined />, label: '首页' },
  { key: '/items', icon: <ShoppingOutlined />, label: '物品图鉴' },
  { key: '/shops', icon: <ShopOutlined />, label: '商店查询' },
  { key: '/builds', icon: <BuildOutlined />, label: '构筑库' },
  { key: '/calculator', icon: <CalculatorOutlined />, label: '计算器' },
  { key: '/matches', icon: <TrophyOutlined />, label: '战绩' },
]

const AppSidebar: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Sider width={200} style={{ background: '#fff' }}>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
        style={{ height: '100%', borderRight: 0 }}
      />
    </Sider>
  )
}

export default AppSidebar
