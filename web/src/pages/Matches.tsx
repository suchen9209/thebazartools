import React from 'react'
import { Card, Table, Tag, Statistic, Row, Col } from 'antd'
import type { ColumnsType } from 'antd/es/table'

interface Match {
  id: string
  date: string
  character: string
  result: 'win' | 'loss'
  finalWins: number
  damage: number
  healing: number
  rounds: number
}

const mockMatches: Match[] = [
  { id: '1', date: '2026-02-26', character: '海盗', result: 'win', finalWins: 7, damage: 1250, healing: 300, rounds: 15 },
  { id: '2', date: '2026-02-26', character: '海盗', result: 'loss', finalWins: 4, damage: 800, healing: 150, rounds: 12 },
  { id: '3', date: '2026-02-25', character: '商人', result: 'win', finalWins: 10, damage: 2000, healing: 800, rounds: 20 },
]

const Matches: React.FC = () => {
  const totalGames = mockMatches.length
  const wins = mockMatches.filter(m => m.result === 'win').length
  const avgDamage = Math.round(mockMatches.reduce((sum, m) => sum + m.damage, 0) / totalGames)

  const columns: ColumnsType<Match> = [
    { title: '日期', dataIndex: 'date', key: 'date' },
    { title: '角色', dataIndex: 'character', key: 'character' },
    { 
      title: '结果', 
      dataIndex: 'result', 
      key: 'result',
      render: (result) => (
        <Tag color={result === 'win' ? 'green' : 'red'}>
          {result === 'win' ? '胜利' : '失败'}
        </Tag>
      )
    },
    { title: '最终胜场', dataIndex: 'finalWins', key: 'finalWins' },
    { title: '总伤害', dataIndex: 'damage', key: 'damage' },
    { title: '总治疗', dataIndex: 'healing', key: 'healing' },
    { title: '回合数', dataIndex: 'rounds', key: 'rounds' },
  ]

  return (
    <div>
      <h2>战绩记录</h2>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card>
            <Statistic title="总对局" value={totalGames} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic 
              title="胜率" 
              value={Math.round(wins/totalGames*100)} 
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="平均伤害" value={avgDamage} />
          </Card>
        </Col>
      </Row>

      <Table 
        dataSource={mockMatches} 
        columns={columns} 
        rowKey="id"
      />
    </div>
  )
}

export default Matches
