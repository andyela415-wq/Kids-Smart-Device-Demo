import TopBar from '../components/TopBar'

const SETTINGS_ITEMS = [
  { title: '音量', desc: '调节设备音量' },
  { title: '亮度', desc: '调节屏幕亮度' },
  { title: 'Wi-Fi', desc: '网络连接设置' },
  { title: '关于设备', desc: '版本 v0.1.0' },
]

export default function Settings() {
  return (
    <>
      <TopBar title="系统设置" backTo="/" />
      <main className="screen-content__body">
        {SETTINGS_ITEMS.map((item) => (
          <div key={item.title} className="list-item">
            <div className="list-item__info">
              <div className="list-item__title">{item.title}</div>
              <div className="list-item__desc">{item.desc}</div>
            </div>
            <span style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>›</span>
          </div>
        ))}
      </main>
    </>
  )
}
