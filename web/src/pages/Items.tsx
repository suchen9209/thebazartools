import React, { useEffect, useState } from 'react'
import { Card, Table, Tag, Input, Select, Space, Image } from 'antd'
import type { ColumnsType } from 'antd/es/table'

const { Search } = Input
const { Option } = Select

interface Item {
  id: string
  name: string
  size: number
  category: string
  rarity: string
  effect: string
  character?: string
  imageUrl?: string
}

const sizeMap: Record<string, number> = {
  'Small': 1,
  'Medium': 2,
  'Large': 3
}

const rarityMap: Record<string, { color: string; label: string }> = {
  'Bronze': { color: 'default', label: '青铜' },
  'Silver': { color: 'blue', label: '白银' },
  'Gold': { color: 'gold', label: '黄金' },
  'Diamond': { color: 'cyan', label: '钻石' },
  'Legendary': { color: 'purple', label: '传说' }
}

const characterMap: Record<string, string> = {
  'Pygmalien': '侏儒',
  'Vanessa': '海盗',
  'Dooley': '机器人',
  'Stelle': '法师',
  'Jules': '游侠',
  'Mak': '战士'
}

const extractRarity = (tags: string[]): string => {
  const rarityTags = ['Bronze', 'Silver', 'Gold', 'Diamond', 'Legendary']
  for (const tag of tags) {
    if (rarityTags.includes(tag)) return tag
  }
  return 'Bronze'
}

const extractCharacter = (tags: string[]): string => {
  const characterTags = ['Pygmalien', 'Vanessa', 'Dooley', 'Stelle', 'Jules', 'Mak']
  for (const tag of tags) {
    if (characterTags.includes(tag)) return characterMap[tag] || tag
  }
  return '通用'
}

const Items: React.FC = () => {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [sizeFilter, setSizeFilter] = useState<number | null>(null)
  const [rarityFilter, setRarityFilter] = useState<string | null>(null)
  const [characterFilter, setCharacterFilter] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    fetch('/data/items.json')
      .then(res => res.json())
      .then(data => {
        const formattedItems = data.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          size: sizeMap[item.sizeName] || item.size,
          category: item.category,
          rarity: extractRarity(item.tags),
          effect: item.effect,
          character: extractCharacter(item.tags),
          imageUrl: item.imageUrl
        }))
        setItems(formattedItems)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load items:', err)
        setLoading(false)
      })
  }, [])

  const filteredItems = items.filter(item => {
    if (searchText && !item.name.toLowerCase().includes(searchText.toLowerCase())) return false
    if (sizeFilter && item.size !== sizeFilter) return false
    if (rarityFilter && item.rarity !== rarityFilter) return false
    if (characterFilter && item.character !== characterFilter) return false
    return true
  })

  const columns: ColumnsType<Item> = [
    {
      title: '图片',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 80,
      render: (url) => url ? (
        <Image
          src={url}
          alt="物品图片"
          width={50}
          height={50}
          style={{ objectFit: 'contain' }}
          preview={false}
        />
      ) : '-'
    },
    { title: '名称', dataIndex: 'name', key: 'name' },
    {
      title: '尺寸',
      dataIndex: 'size',
      key: 'size',
      render: (size) => `${size}格`,
    },
    {
      title: '类别',
      dataIndex: 'category',
      key: 'category',
      render: (cat) => {
        const map: Record<string, string> = {
          weapon: '武器',
          tool: '工具',
          trap: '陷阱',
          water: '水系',
          other: '其他'
        }
        return map[cat] || cat
      },
    },
    {
      title: '稀有度',
      dataIndex: 'rarity',
      key: 'rarity',
      render: (rarity) => {
        const config = rarityMap[rarity] || { color: 'default', label: rarity }
        return <Tag color={config.color}>{config.label}</Tag>
      },
    },
    { title: '效果', dataIndex: 'effect', key: 'effect', ellipsis: true },
    {
      title: '角色',
      dataIndex: 'character',
      key: 'character',
      render: (char) => char || '通用',
    },
  ]

  return (
    <div>
      <h2>物品图鉴</h2>

      <Card style={{ marginBottom: 16 }}>
        <Space wrap>
          <Search
            placeholder="搜索物品名称"
            style={{ width: 200 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
          <Select
            placeholder="筛选尺寸"
            style={{ width: 120 }}
            allowClear
            value={sizeFilter}
            onChange={setSizeFilter}
          >
            <Option value={1}>小型(1格)</Option>
            <Option value={2}>中型(2格)</Option>
            <Option value={3}>大型(3格)</Option>
          </Select>
          <Select
            placeholder="筛选稀有度"
            style={{ width: 120 }}
            allowClear
            value={rarityFilter}
            onChange={setRarityFilter}
          >
            <Option value="Bronze">青铜</Option>
            <Option value="Silver">白银</Option>
            <Option value="Gold">黄金</Option>
            <Option value="Diamond">钻石</Option>
            <Option value="Legendary">传说</Option>
          </Select>
          <Select
            placeholder="筛选角色"
            style={{ width: 120 }}
            allowClear
            value={characterFilter}
            onChange={setCharacterFilter}
          >
            <Option value="侏儒">侏儒</Option>
            <Option value="海盗">海盗</Option>
            <Option value="机器人">机器人</Option>
            <Option value="法师">法师</Option>
            <Option value="游侠">游侠</Option>
            <Option value="战士">战士</Option>
            <Option value="通用">通用</Option>
          </Select>
        </Space>
      </Card>

      <Table
        dataSource={filteredItems}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        loading={loading}
      />
    </div>
  )
}

export default Items
