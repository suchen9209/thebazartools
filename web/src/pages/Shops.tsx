import React, { useEffect, useState, useMemo } from 'react'
import { Card, Select, Space, Tag, Row, Col, Empty, Spin, Tooltip, Badge } from 'antd'
import { ShopOutlined, UserOutlined, InfoCircleOutlined } from '@ant-design/icons'

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
const SIZE_CONFIG: Record<string, { label: string; color: string }> = {
  'Small': { label: '小型', color: '#68d391' },
  'Medium': { label: '中型', color: '#f6ad55' },
  'Large': { label: '大型', color: '#fc8181' }
}

interface Merchant {
  id: string
  name: string
  nameEn: string
  description: { Text: string }
  tags: string[]
  imageUrl: string
  artFg?: string
  baseTier?: string
  heroes?: string[]
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
            width: 8,
            height: 8,
            backgroundColor: config.color,
            borderRadius: 2,
            border: '1px solid rgba(0,0,0,0.1)'
          }}
        />
      ))}
    </div>
  )
}

// 商店卡片组件
const ShopCard: React.FC<{ 
  merchant: Merchant; 
  isSelected: boolean; 
  onClick: () => void;
  itemCount: number;
}> = ({ merchant, isSelected, onClick, itemCount }) => {
  const heroTags = merchant.tags.filter(tag => Object.keys(HERO_MAP).includes(tag))
  const mainHero = heroTags.length > 0 ? HERO_MAP[heroTags[0]] : HERO_MAP['Common']
  
  return (
    <Card
      hoverable
      onClick={onClick}
      style={{
        cursor: 'pointer',
        borderRadius: 12,
        border: isSelected ? `3px solid ${mainHero.color}` : '2px solid #e2e8f0',
        background: isSelected ? `linear-gradient(135deg, ${mainHero.color}15 0%, #ffffff 100%)` : '#fff',
        transition: 'all 0.3s ease'
      }}
      bodyStyle={{ padding: 16 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* 商店图标 */}
        <div style={{ position: 'relative' }}>
          <img
            src={merchant.imageUrl}
            alt={merchant.name}
            style={{
              width: 64,
              height: 64,
              objectFit: 'contain',
              borderRadius: 8,
              background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
              padding: 4
            }}
          />
          <Badge 
            count={itemCount} 
            style={{ 
              backgroundColor: mainHero.color,
              fontSize: 11,
              fontWeight: 600
            }}
          />
        </div>
        
        {/* 商店信息 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h4
            style={{
              margin: 0,
              marginBottom: 4,
              fontSize: 16,
              fontWeight: 700,
              color: isSelected ? mainHero.color : '#1a202c',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {merchant.name}
          </h4>
          
          <p
            style={{
              margin: 0,
              fontSize: 12,
              color: '#718096',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {merchant.description?.Text || '出售各种物品'}
          </p>
          
          <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {heroTags.slice(0, 3).map(heroKey => (
              <Tag 
                key={heroKey} 
                style={{ 
                  backgroundColor: HERO_MAP[heroKey]?.color + '20',
                  color: HERO_MAP[heroKey]?.color,
                  borderColor: HERO_MAP[heroKey]?.color + '40',
                  fontSize: 11,
                  padding: '0 6px',
                  lineHeight: '18px'
                }}
              >
                {HERO_MAP[heroKey]?.name}
              </Tag>
            ))}
            {merchant.baseTier && (
              <Tag 
                color={RARITY_CONFIG[merchant.baseTier]?.color}
                style={{ fontSize: 11, padding: '0 6px', lineHeight: '18px' }}
              >
                {RARITY_CONFIG[merchant.baseTier]?.label}
              </Tag>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

// 物品卡片组件
const ShopItemCard: React.FC<{ item: Item }> = ({ item }) => {
  const hero = HERO_MAP[item.characterCode] || HERO_MAP['Common']
  const rarityConfig = RARITY_CONFIG[item.rarityName] || RARITY_CONFIG['Silver']
  const sizeConfig = SIZE_CONFIG[item.sizeName] || { label: item.sizeName, color: '#cbd5e0' }
  
  // 获取该物品可用的最低价格
  const getDisplayPrice = () => {
    const tiers = ['bronze', 'silver', 'gold', 'diamond', 'legendary'] as const
    for (const tier of tiers) {
      if (item.stats[tier]?.buyPrice) {
        return {
          price: item.stats[tier]!.buyPrice,
          tier: tier.charAt(0).toUpperCase() + tier.slice(1)
        }
      }
    }
    return null
  }
  
  const priceInfo = getDisplayPrice()
  
  return (
    <Card
      hoverable
      style={{
        height: '100%',
        borderRadius: 10,
        overflow: 'hidden',
        border: `1px solid ${rarityConfig.borderColor}`,
        background: '#fff'
      }}
      bodyStyle={{ padding: 0 }}
    >
      {/* 图片区域 */}
      <div
        style={{
          position: 'relative',
          padding: 12,
          background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 100
        }}
      >
        <img
          src={item.imageUrl}
          alt={item.name}
          style={{
            width: 80,
            height: 80,
            objectFit: 'contain',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
          }}
        />
        
        {/* 尺寸标识 */}
        <Tooltip title={sizeConfig.label}>
          <div
            style={{
              position: 'absolute',
              top: 6,
              left: 6,
              backgroundColor: 'rgba(0,0,0,0.6)',
              padding: '3px 6px',
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <SizeIcon sizeName={item.sizeName} />
          </div>
        </Tooltip>
        
        {/* 冷却时间 */}
        {item.cooldown && (
          <div
            style={{
              position: 'absolute',
              top: 6,
              right: 6,
              backgroundColor: 'rgba(0,0,0,0.6)',
              padding: '3px 6px',
              borderRadius: 4,
              color: '#fff',
              fontSize: 11,
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
            bottom: 6,
            right: 6,
            backgroundColor: hero.color,
            padding: '2px 8px',
            borderRadius: 10,
            color: '#fff',
            fontSize: 11,
            fontWeight: 600
          }}
        >
          {hero.name}
        </div>
      </div>
      
      {/* 内容区域 */}
      <div style={{ padding: 12 }}>
        {/* 物品名称 */}
        <h5
          style={{
            margin: 0,
            marginBottom: 6,
            fontSize: 14,
            fontWeight: 600,
            color: '#1a202c',
            lineHeight: 1.3,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {item.name}
        </h5>
        
        {/* 效果描述 */}
        <p
          style={{
            margin: 0,
            marginBottom: 10,
            fontSize: 12,
            color: '#4a5568',
            lineHeight: 1.5,
            height: 36,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {item.effect}
        </p>
        
        {/* 价格和稀有度 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Tag
            style={{
              backgroundColor: rarityConfig.bgColor,
              color: rarityConfig.color,
              borderColor: rarityConfig.borderColor,
              fontSize: 11,
              fontWeight: 500,
              padding: '0 6px',
              lineHeight: '18px'
            }}
          >
            {rarityConfig.label}
          </Tag>
          
          {priceInfo && (
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: '#d69e2e'
              }}
            >
              {priceInfo.price}💰
            </span>
          )}
        </div>
      </div>
    </Card>
  )
}

const Shops: React.FC = () => {
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedMerchantId, setSelectedMerchantId] = useState<string | null>(null)
  const [heroFilter, setHeroFilter] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetch('/data/merchants.json').then(res => res.json()),
      fetch('/data/items.json').then(res => res.json())
    ])
      .then(([merchantsData, itemsData]) => {
        setMerchants(merchantsData.data || [])
        setItems(itemsData.data || [])
        if (merchantsData.data?.length > 0) {
          setSelectedMerchantId(merchantsData.data[0].id)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load data:', err)
        setLoading(false)
      })
  }, [])

  const filteredMerchants = useMemo(() => {
    if (!heroFilter) return merchants
    return merchants.filter(merchant => 
      merchant.tags.includes(heroFilter) || merchant.tags.includes('Common')
    )
  }, [merchants, heroFilter])

  const selectedMerchant = useMemo(() => {
    return merchants.find(m => m.id === selectedMerchantId)
  }, [merchants, selectedMerchantId])

  const merchantItems = useMemo(() => {
    if (!selectedMerchant) return []
    
    const merchantHeroes = selectedMerchant.tags.filter(tag => 
      Object.keys(HERO_MAP).includes(tag) && tag !== 'Common'
    )
    
    return items.filter(item => {
      // 如果是通用商店，显示所有物品
      if (selectedMerchant.tags.includes('Common') && merchantHeroes.length === 0) {
        return true
      }
      
      // 否则只显示对应英雄的物品
      if (merchantHeroes.length > 0) {
        return merchantHeroes.includes(item.characterCode)
      }
      
      return true
    })
  }, [selectedMerchant, items])

  const getItemCountForMerchant = (merchant: Merchant) => {
    const merchantHeroes = merchant.tags.filter(tag => 
      Object.keys(HERO_MAP).includes(tag) && tag !== 'Common'
    )
    
    if (merchant.tags.includes('Common') && merchantHeroes.length === 0) {
      return items.length
    }
    
    if (merchantHeroes.length > 0) {
      return items.filter(item => merchantHeroes.includes(item.characterCode)).length
    }
    
    return items.length
  }

  return (
    <div style={{ padding: '0 0 24px' }}>
      <h2 style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
        <ShopOutlined style={{ fontSize: 28, color: '#1890ff' }} />
        <span>商店查询</span>
        <span style={{ fontSize: 14, color: '#718096', fontWeight: 400 }}>
          共 {merchants.length} 个商店
        </span>
      </h2>

      {/* 筛选栏 */}
      <Card style={{ marginBottom: 24, borderRadius: 12 }}>
        <Space wrap size="middle">
          <Select
            placeholder="筛选商店角色"
            style={{ width: 180 }}
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
          
          <Tooltip title="选择商店查看可购买的物品">
            <Tag icon={<InfoCircleOutlined />} color="blue">
              点击商店卡片查看商品
            </Tag>
          </Tooltip>
        </Space>
      </Card>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <Spin size="large" />
          <p style={{ marginTop: 16, color: '#718096' }}>加载商店数据中...</p>
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {/* 左侧商店列表 */}
          <Col xs={24} lg={8}>
            <div style={{ marginBottom: 16 }}>
              <h4 style={{ margin: 0, marginBottom: 12, color: '#4a5568' }}>
                商店列表 ({filteredMerchants.length})
              </h4>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filteredMerchants.map(merchant => (
                <ShopCard
                  key={merchant.id}
                  merchant={merchant}
                  isSelected={selectedMerchantId === merchant.id}
                  onClick={() => setSelectedMerchantId(merchant.id)}
                  itemCount={getItemCountForMerchant(merchant)}
                />
              ))}
            </div>
          </Col>
          
          {/* 右侧商品列表 */}
          <Col xs={24} lg={16}>
            {selectedMerchant ? (
              <>
                <Card
                  style={{ 
                    marginBottom: 16, 
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #f7fafc 0%, #ffffff 100%)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <img
                      src={selectedMerchant.imageUrl}
                      alt={selectedMerchant.name}
                      style={{
                        width: 80,
                        height: 80,
                        objectFit: 'contain',
                        borderRadius: 12,
                        background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
                        padding: 8
                      }}
                    />
                    <div>
                      <h3 style={{ margin: 0, marginBottom: 8, fontSize: 22, fontWeight: 700 }}>
                        {selectedMerchant.name}
                      </h3>
                      <p style={{ margin: 0, color: '#718096', fontSize: 14 }}>
                        {selectedMerchant.description?.Text || '出售各种物品'}
                      </p>
                      
                      <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {selectedMerchant.tags
                          .filter(tag => Object.keys(HERO_MAP).includes(tag))
                          .map(heroKey => (
                            <Tag 
                              key={heroKey}
                              color={HERO_MAP[heroKey]?.color}
                              style={{ fontSize: 12 }}
                            >
                              {HERO_MAP[heroKey]?.name}
                            </Tag>
                          ))}
                      </div>
                    </div>
                  </div>
                </Card>
                
                <div style={{ marginBottom: 12 }}>
                  <h4 style={{ margin: 0, color: '#4a5568' }}>
                    商品列表 ({merchantItems.length} 个物品)
                  </h4>
                </div>
                
                {merchantItems.length === 0 ? (
                  <Empty description="该商店暂无商品数据" />
                ) : (
                  <Row gutter={[12, 12]}>
                    {merchantItems.map(item => (
                      <Col 
                        key={item.id} 
                        xs={12}
                        sm={12}
                        md={8}
                        lg={8}
                        xl={6}
                      >
                        <ShopItemCard item={item} />
                      </Col>
                    ))}
                  </Row>
                )}
              </>
            ) : (
              <Empty description="请选择一个商店" />
            )}
          </Col>
        </Row>
      )}
    </div>
  )
}

export default Shops
