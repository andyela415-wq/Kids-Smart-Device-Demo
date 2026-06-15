import TopBar from '../components/TopBar'

export default function Dictionary() {
  return (
    <>
      <TopBar title="电子词典" backTo="/" />
      <main className="screen-content__body screen-content__body--center">
        <div className="placeholder-box">
          <span className="placeholder-box__icon">🔤</span>
          <p>电子词典模块</p>
          <p style={{ fontSize: 'var(--font-size-xs)' }}>功能开发中...</p>
        </div>
      </main>
    </>
  )
}
