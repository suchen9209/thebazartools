import React, { useEffect, useState, useMemo } from 'react'
import { Card, Input, Select, Space, Tag, Tooltip, Row, Col, Empty, Spin } from 'antd'
import { SearchOutlined, AppstoreOutlined, GoldOutlined, UserOutlined } from '@ant-design/icons'

const { Search } = Input
const { Option } = Select

// 英雄名称映射
const HERO_MAP: Record<string, { name: string; color: string }> = {
  'Pygmalien': { name: '侏儒', color: '#f6ad55' },
  'Vanessa': { name: '海盗', color: '#63b3ed' },
  'Dooley': { name: '机器人', color: '#a0aec0' },
  'Stelle': { name: '法师', color: '#b794f4' },
  'Jules': { name: '游侠', color: '#68d391' },
  'Mak': { name: '战士', color: '#fc8181' },
  'Common': { name: '通用', color: '#718096' }
}

// 稀有度配置
const RARITY_CONFIG: Record<string, { label: string; color: string; bgColor: string; borderColor: string }> = {
  'Bronze': { label: '青铜', color: '#8B4513', bgColor: '#fff8f0', borderColor: '#d4a574' },
  'Silver': { label: '白银', color: '#4a5568', bgColor: '#f7fafc', borderColor: '#a0aec0' },
  'Gold': { label: '黄金', color: '#b7791f', bgColor: '#fffbeb', borderColor: '#f6ad55' },
  'Diamond': { label: '钻石', color: '#008080', bgColor: '#e6fffa', borderColor: '#38b2ac' },
  'Legendary': { label: '传说', color: '#805ad5', bgColor: '#faf5ff', borderColor: '#b794f4' }
}

// 尺寸配置
const SIZE_CONFIG: Record<string, { label: string; icon: string; gridClass: string }> = {
  'Small': { label: '小型', icon: '□', gridClass: 'grid-cols-1' },
  'Medium': { label: '中型', icon: '▭', gridClass: 'grid-cols-2' },
  'Large': { label: '大型', icon: '▯', gridClass: 'grid-cols-3' }
}

interface Item {
  id: string
  name: string
  nameEn: string
  size: number
  sizeName: string
  category: string
  rarity: string
  rarityName: string
  character: string
  characterCode: string
  effect: string
  cooldown: number | null
  tags: string[]
  enchantments: number
  imageUrl: string
  cardUrl: string
  stats: {
    bronze?: { buyPrice?: number; sellPrice?: number }
    silver?: { buyPrice?: number; sellPrice?: number }
    gold?: { buyPrice?: number; sellPrice?: number }
    diamond?: { buyPrice?: number; sellPrice?: number }
    legendary?: { buyPrice?: number; sellPrice?: number }
  }
}

// 尺寸图标组件
const SizeIcon: React.FC<{ sizeName: string }> = ({ sizeName }) => {
  const sizeMap: Record<string, { count: number; color: string }> = {
    'Small': { count: 1, color: '#68d391' },
    'Medium': { count: 2, color: '#f6ad55' },
    'Large': { count: 3, color: '#fc8181' }
  }
  const config = sizeMap[sizeName] || { count: 1, color: '#cbd5e0' }
  
  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      {Array.from({ length: config.count }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 10,
            height: 10,
            backgroundColor: config.color,
            borderRadius: 2,
            border: '1px solid rgba(0,0,0,0.1)'
          }}
        />
      ))}
    </div>
  )
}

// 稀有度价格标签
const PriceTag: React.FC<{ rarity: string; buyPrice?: number; sellPrice?: number }> = ({ 
  rarity, 
  buyPrice, 
  sellPrice 
}) => {
  const config = RARITY_CONFIG[rarity] || RARITY_CONFIG['Silver']
  
  return (
    <Tooltip title={`买入: ${buyPrice || '-'} / 卖出: ${sellPrice || '-'}`}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          padding: '2px 8px',
          borderRadius: 4,
          backgroundColor: config.bgColor,
          border: `1px solid ${config.borderColor}`,
          fontSize: 11,
          color: config.color,
          fontWeight: 500
        }}
      >
        <span>{config.label}</span>
        {buyPrice !== undefined && (
          <span style={{ fontWeight: 600 }}>{buyPrice}</span>
        )}
      </div>
    </Tooltip>
  )
}

// 物品卡片组件
const ItemCard: React.FC<{ item: Item }> = ({ item }) => {
  const hero = HERO_MAP[item.characterCode] || HERO_MAP['Common']
  const rarityConfig = RARITY_CONFIG[item.rarityName] || RARITY_CONFIG['Silver']
  
  return (
    <Card
      hoverable
      className="item-card"
      style={{
        height: '100%',
        borderRadius: 12,
        overflow: 'hidden',
        border: `2px solid ${rarityConfig.borderColor}`,
        background: `linear-gradient(135deg, ${rarityConfig.bgColor} 0%, #ffffff 100%)`
      }}
      bodyStyle={{ padding: 0 }}
    >
      {/* 图片区域 */}
      <div
        style={{
          position: 'relative',
          padding: 16,
          background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 160
        }}
      >
        <img
          src={item.imageUrl}
          alt={item.name}
          style={{
            width: 128,
            height: 128,
            objectFit: 'contain',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
          }}
        />
        
        {/* 尺寸标识 */}
        <div
          style={{
            position: 'absolute',
            top: 8,
            left: 8,
            backgroundColor: 'rgba(0,0,0,0.6)',
            padding: '4px 8px',
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          <SizeIcon sizeName={item.sizeName} />
          <span style={{ color: '#fff', fontSize: 12, fontWeight: 500 }}>
            {SIZE_CONFIG[item.sizeName]?.label || item.sizeName}
          </span>
        </div>
        
        {/* 冷却时间 */}
        {item.cooldown && (
          <div
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'rgba(0,0,0,0.6)',
              padding: '4px 8px',
              borderRadius: 4,
              color: '#fff',
              fontSize: 12,
              fontWeight: 500
            }}
          >
            {item.cooldown}s
          </div>
        )}
        
        {/* 英雄标签 */}
        <div
          style={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            backgroundColor: hero.color,
            padding: '4px 10px',
            borderRadius: 12,
            color: '#fff',
            fontSize: 12,
            fontWeight: 600,
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          {hero.name}
        </div>
      </div>
      
      {/* 内容区域 */}
      <div style={{ padding: 16 }}>
        {/* 物品名称 */}
        <h3
          style={{
            margin: 0,
            marginBottom: 8,
            fontSize: 18,
            fontWeight: 700,
            color: '#1a202c',
            lineHeight: 1.3
          }}
        >
          {item.name}
        </h3>
        
        {/* 英文名称 */}
        <p
          style={{
            margin: 0,
            marginBottom: 12,
            fontSize: 12,
            color: '#718096',
            fontStyle: 'italic'
          }}
        >
          {item.nameEn}
        </p>
        
        {/* 效果描述 */}
        <div
          style={{
            marginBottom: 16,
            padding: 12,
            backgroundColor: '#f7fafc',
            borderRadius: 8,
            fontSize: 13,
            color: '#4a5568',
            lineHeight: 1.6,
            minHeight: 60
          }}
        >
          {item.effect}
        </div>
        
        {/* 价格区域 */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          {item.stats.bronze && (
            <PriceTag 
              rarity="Bronze" 
              buyPrice={item.stats.bronze.buyPrice} 
              sellPrice={item.stats.bronze.sellPrice} 
            />
          )}
          {item.stats.silver && (
            <PriceTag 
              rarity="Silver" 
              buyPrice={item.stats.silver.buyPrice} 
              sellPrice={item.stats.silver.sellPrice} 
            />
          )}
          {item.stats.gold && (
            <PriceTag 
              rarity="Gold" 
              buyPrice={item.stats.gold.buyPrice} 
              sellPrice={item.stats.gold.sellPrice} 
            />
          )}
          {item.stats.diamond && (
            <PriceTag 
              rarity="Diamond" 
              buyPrice={item.stats.diamond.buyPrice} 
              sellPrice={item.stats.diamond.sellPrice} 
            />
          )}
          {item.stats.legendary && (
            <PriceTag 
              rarity="Legendary" 
              buyPrice={item.stats.legendary.buyPrice} 
              sellPrice={item.stats.legendary.sellPrice} 
            />
          )}
        </div>
        
        {/* 标签 */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {item.tags.filter(tag => 
            !['Item', 'Skill', 'Small', 'Medium', 'Large'].includes(tag) &&
            !Object.keys(HERO_MAP).includes(tag)
          ).slice(0, 4).map(tag => (
            <Tag key={tag} style={{ fontSize: 11, padding: '0 6px', lineHeight: '18px' }}>
              {tag}
            </Tag>
          ))}
        </div>
      </div>
    </Card>
  )
}

const Items: React.FC = () => {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [sizeFilter, setSizeFilter] = useState<string | null>(null)
  const [rarityFilter, setRarityFilter] = useState<string | null>(null)
  const [heroFilter, setHeroFilter] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    fetch('/data/items.json')
      .then(res => res.json())
      .then(data => {
        setItems(data.data || [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load items:', err)
        setLoading(false)
      })
  }, [])

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (searchText) {
        const searchLower = searchText.toLowerCase()
        const matchName = item.name.toLowerCase().includes(searchLower)
        const matchNameEn = item.nameEn.toLowerCase().includes(searchLower)
        const matchEffect = item.effect.toLowerCase().includes(searchLower)
        if (!matchName && !matchNameEn && !matchEffect) return false
      }
      if (sizeFilter && item.sizeName !== sizeFilter) return false
      if (rarityFilter && item.rarityName !== rarityFilter) return false
      if (heroFilter && item.characterCode !== heroFilter) return false
      return true
    })
  }, [items, searchText, sizeFilter, rarityFilter, heroFilter])

  return (
    <div style={{ padding: '0 0 24px' }}>
      <h2 style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
        <AppstoreOutlined style={{ fontSize: 28, color: '#1890ff' }} />
        <span>物品图鉴</span>
        <span style={{ fontSize: 14, color: '#718096', fontWeight: 400 }}>
          共 {filteredItems.length} 个物品
        </span>
      </h2>

      {/* 筛选栏 */}
      <Card style={{ marginBottom: 24, borderRadius: 12 }}>
        <Space wrap size="middle">
          <Search
            placeholder="搜索物品名称或效果"
            style={{ width: 280 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            prefix={<SearchOutlined />}
          />
          
          <Select
            placeholder="筛选尺寸"
            style={{ width: 140 }}
            allowClear
            value={sizeFilter}
            onChange={setSizeFilter}
            prefix={<AppstoreOutlined />}
          >
            <Option value="Small">
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <SizeIcon sizeName="Small" /> 小型 (1格)
              </span>
            </Option>
            <Option value="Medium">
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <SizeIcon sizeName="Medium" /> 中型 (2格)
              </span>
            </Option>
            <Option value="Large">
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <SizeIcon sizeName="Large" /> 大型 (3格)
              </span>
            </Option>
          </Select>
          
          <Select
            placeholder="筛选稀有度"
            style={{ width: 140 }}
            allowClear
            value={rarityFilter}
            onChange={setRarityFilter}
            prefix={<GoldOutlined />}
          >
            {Object.entries(RARITY_CONFIG).map(([key, config]) => (
              <Option key={key} value={key}>
                <span style={{ color: config.color, fontWeight: 500 }}>
                  {config.label}
                </span>
              </Option>
            ))}
          </Select>
          
          <Select
            placeholder="筛选角色"
            style={{ width: 140 }}
            allowClear
            value={heroFilter}
            onChange={setHeroFilter}
            prefix={<UserOutlined />}
          >
            {Object.entries(HERO_MAP).map(([key, hero]) => (
              <Option key={key} value={key}>
                <span style={{ color: hero.color, fontWeight: 500 }}>
                  {hero.name}
                </span>
              </Option>
            ))}
          </Select>
        </Space>
      </Card>

      {/* 物品网格 */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <Spin size="large" />
          <p style={{ marginTop: 16, color: '#718096' }}>加载物品数据中...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <Empty
          description="没有找到匹配的物品"
          style={{ padding: 60 }}
        />
      ) : (
        <Row gutter={[16, 16]}>
          {filteredItems.map(item => (
            <Col 
              key={item.id} 
              xs={24}   // 手机: 1列
              sm={12}   // 平板: 2列
              md={12}   // 小桌面: 2列
              lg={8}    // 中桌面: 3列
              xl={6}    // 大桌面: 4列
              xxl={4}   // 超大屏: 5列
            >
              <ItemCard item={item} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
}

export default Items
