import React, { useEffect, useState } from 'react'
import { Card, Select, Table, Tag, Image } from 'antd'
import type { ColumnsType } from 'antd/es/table'

const { Option } = Select

interface ShopItem {
  id: string
  name: string
  size: number
  rarity: string
  price: number
  dayAvailable: number
  imageUrl?: string
}

interface Shop {
  id: string
  name: string
  type: string
  description: string
  imageUrl?: string
  items: ShopItem[]
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

const extractRarity = (tags: string[]): string => {
  const rarityTags = ['Bronze', 'Silver', 'Gold', 'Diamond', 'Legendary']
  for (const tag of tags) {
    if (rarityTags.includes(tag)) return tag
  }
  return 'Bronze'
}

const Shops: React.FC = () => {
  const [shops, setShops] = useState<Shop[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedShop, setSelectedShop] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetch('/data/merchants.json').then(res => res.json()),
      fetch('/data/items.json').then(res => res.json())
    ])
      .then(([merchantsData, itemsData]) => {
        // 处理商店数据
        const formattedShops = merchantsData.data.map((shop: any) => {
          // 从商店的角色标签来筛选相关物品
          const shopCharacters = shop.tags.filter((tag: string) => 
            ['Pygmalien', 'Vanessa', 'Dooley', 'Stelle', 'Jules', 'Mak'].includes(tag)
          )
          
          // 获取相关物品（属于该商店的角色，或者是通用物品）
          const relatedItems = itemsData.data.filter((item: any) => {
            const itemCharacters = item.tags.filter((tag: string) => 
              ['Pygmalien', 'Vanessa', 'Dooley', 'Stelle', 'Jules', 'Mak'].includes(tag)
            )
            // 如果商店有特定角色，显示该角色的物品；否则显示通用物品
            if (shopCharacters.length > 0) {
              return itemCharacters.some((char: string) => shopCharacters.includes(char))
            }
            return itemCharacters.length === 0 || shop.tags.includes('Common')
          }).slice(0, 20) // 限制每个商店显示的物品数量

          const shopItems: ShopItem[] = relatedItems.map((item: any, index: number) => ({
            id: item.id,
            name: item.name,
            size: sizeMap[item.sizeName] || item.size,
            rarity: extractRarity(item.tags),
            price: item.stats?.diamond?.buyPrice || item.stats?.gold?.buyPrice || item.stats?.silver?.buyPrice || 0,
            dayAvailable: (index % 5) + 1, // 模拟出现天数
            imageUrl: item.imageUrl
          }))

          return {
            id: shop.id,
            name: shop.name,
            type: shop.tags.find((tag: string) => tag === 'Merchant') ? 'merchant' : 'event',
            description: shop.description?.Text || '',
            imageUrl: shop.imageUrl,
            items: shopItems
          }
        })

        setShops(formattedShops)
        if (formattedShops.length > 0) {
          setSelectedShop(formattedShops[0].id)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load shops:', err)
        setLoading(false)
      })
  }, [])

  const currentShop = shops.find(s => s.id === selectedShop)

  const columns: ColumnsType<ShopItem> = [
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
    { title: '物品名称', dataIndex: 'name', key: 'name' },
    { title: '尺寸', dataIndex: 'size', key: 'size', render: (s) => `${s}格` },
    {
      title: '稀有度',
      dataIndex: 'rarity',
      key: 'rarity',
      render: (r) => {
        const config = rarityMap[r] || { color: 'default', label: r }
        return <Tag color={config.color}>{config.label}</Tag>
      }
    },
    { title: '价格', dataIndex: 'price', key: 'price', render: (p) => p ? `${p}金币` : '-' },
    { title: '出现天数', dataIndex: 'dayAvailable', key: 'dayAvailable', render: (d) => `第${d}天` },
  ]

  return (
    <div>
      <h2>商店查询</h2>

      <Card style={{ marginBottom: 16 }}>
        <Select
          value={selectedShop}
          onChange={setSelectedShop}
          style={{ width: 300 }}
          loading={loading}
          placeholder="选择商店"
        >
          {shops.map(shop => (
            <Option key={shop.id} value={shop.id}>{shop.name}</Option>
          ))}
        </Select>
      </Card>

      {currentShop && (
        <Card 
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {currentShop.imageUrl && (
                <Image
                  src={currentShop.imageUrl}
                  alt={currentShop.name}
                  width={40}
                  height={40}
                  style={{ objectFit: 'contain', borderRadius: 4 }}
                  preview={false}
                />
              )}
              <span>{currentShop.name}</span>
            </div>
          }
        >
          {currentShop.description && (
            <p style={{ marginBottom: 16, color: '#666' }}>{currentShop.description}</p>
          )}
          <Table
            dataSource={currentShop.items}
            columns={columns}
            rowKey="id"
            pagination={false}
            locale={{ emptyText: '暂无商品数据' }}
          />
        </Card>
      )}
    </div>
  )
}

export default Shops
