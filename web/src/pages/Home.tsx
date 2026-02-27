import React from 'react'
import { Card, Row, Col, Statistic } from 'antd'
import { ShoppingOutlined, BuildOutlined, TrophyOutlined } from '@ant-design/icons'

const Home: React.FC = () => {
  return (
    <div>
      <h1>欢迎使用大巴扎助手</h1>
      <p style={{ color: '#666', marginBottom: 24 }}>
        为 The Bazaar 玩家提供专业的游戏辅助工具
      </p>
      
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="物品数量"
              value={500}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="构筑方案"
              value={100}
              prefix={<BuildOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="战绩记录"
              value={50}
              prefix={<TrophyOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card title="快速开始" style={{ marginTop: 24 }}>
        <ul>
          <li><a href="#/items">浏览物品图鉴</a> - 查看所有物品的详细数据</li>
          <li><a href="#/shops">查询商店</a> - 了解各商店的可售物品</li>
          <li><a href="#/builds">管理构筑</a> - 保存和分享你的构筑方案</li>
          <li><a href="#/calculator">伤害计算</a> - 计算理论输出和优化摆放</li>
        </ul>
      </Card>
    </div>
  )
}

export default Home
