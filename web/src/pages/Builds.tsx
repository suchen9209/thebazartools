import React from 'react'
import { Card, Button, List, Tag, Space, Modal, Form, Input } from 'antd'
import { PlusOutlined, ShareAltOutlined } from '@ant-design/icons'

interface Build {
  id: string
  name: string
  character: string
  wins: number
  games: number
  tags: string[]
}

const mockBuilds: Build[] = [
  { id: '1', name: '海盗武器流', character: '海盗', wins: 8, games: 10, tags: ['武器', '爆发'] },
  { id: '2', name: '水系成长流', character: '海盗', wins: 7, games: 10, tags: ['水系', '成长'] },
  { id: '3', name: '永冻控制流', character: '炼金术士', wins: 9, games: 12, tags: ['冰冻', '控制'] },
]

const Builds: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [form] = Form.useForm()

  const handleCreate = (values: any) => {
    console.log('创建构筑:', values)
    setIsModalOpen(false)
    form.resetFields()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>构筑库</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
          新建构筑
        </Button>
      </div>

      <List
        grid={{ gutter: 16, column: 2 }}
        dataSource={mockBuilds}
        renderItem={(build) => (
          <List.Item>
            <Card
              title={build.name}
              extra={
                <Button icon={<ShareAltOutlined />} size="small">分享</Button>
              }
            >
              <p>角色: {build.character}</p>
              <p>胜率: {build.wins}/{build.games} ({Math.round(build.wins/build.games*100)}%)</p>
              <Space>
                {build.tags.map(tag => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </Space>
            </Card>
          </List.Item>
        )}
      />

      <Modal
        title="新建构筑"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleCreate}>
          <Form.Item name="name" label="构筑名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="character" label="角色" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Builds
