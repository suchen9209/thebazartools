import React from 'react'
import { Card, Row, Col, Select, Button, InputNumber } from 'antd'
import ReactECharts from 'echarts-for-react'

const { Option } = Select

const Calculator: React.FC = () => {
  const [items] = React.useState([
    { id: 1, name: '水手刀', damage: 10, cooldown: 3 },
    { id: 2, name: '鱼叉炮', damage: 25, cooldown: 5 },
  ])

  // 计算输出曲线
  const calculateDPS = () => {
    const timePoints = Array.from({ length: 31 }, (_, i) => i) // 0-30秒
    const data = timePoints.map(t => {
      let total = 0
      items.forEach(item => {
        const triggers = Math.floor(t / item.cooldown)
        total += triggers * item.damage
      })
      return total
    })
    return { timePoints, data }
  }

  const { timePoints, data } = calculateDPS()

  const chartOption = {
    title: { text: '理论输出曲线' },
    xAxis: { type: 'category', data: timePoints, name: '时间(秒)' },
    yAxis: { type: 'value', name: '累计伤害' },
    series: [{
      data,
      type: 'line',
      smooth: true,
      areaStyle: {}
    }]
  }

  return (
    <div>
      <h2>伤害计算器</h2>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="当前物品">
            {items.map((item) => (
              <div key={item.id} style={{ marginBottom: 8 }}>
                <Select value={item.name} style={{ width: 150, marginRight: 8 }}>
                  <Option value="水手刀">水手刀</Option>
                  <Option value="鱼叉炮">鱼叉炮</Option>
                  <Option value="锚链锤">锚链锤</Option>
                </Select>
                <InputNumber 
                  value={item.damage} 
                  style={{ width: 80, marginRight: 8 }}
                  addonBefore="伤害"
                />
                <InputNumber 
                  value={item.cooldown} 
                  style={{ width: 80 }}
                  addonBefore="CD"
                />
              </div>
            ))}
            <Button type="dashed" style={{ marginTop: 8 }}>+ 添加物品</Button>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="计算结果">
            <p>理论 DPS: {(data[data.length-1] / 30).toFixed(2)}</p>
            <p>30秒总伤害: {data[data.length-1]}</p>
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: 16 }}>
        <ReactECharts option={chartOption} style={{ height: 300 }} />
      </Card>
    </div>
  )
}

export default Calculator
