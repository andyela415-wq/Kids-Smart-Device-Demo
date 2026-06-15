import { useEffect } from 'react'
import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router-dom'

export default function DeviceRouteFallback() {
  const error = useRouteError()
  const navigate = useNavigate()
  const is404 = isRouteErrorResponse(error) && error.status === 404

  useEffect(() => {
    if (is404) {
      navigate('/', { replace: true })
    }
  }, [is404, navigate])

  if (is404) {
    return null
  }

  return (
    <main className="screen-content">
      <div className="screen-content__body screen-content__body--center">
        <p style={{ color: 'rgba(255,235,210,0.9)', fontSize: 12, margin: 0 }}>页面加载出错</p>
        <button
          type="button"
          className="btn btn--primary"
          style={{ marginTop: 10, height: 32, fontSize: 12 }}
          onClick={() => navigate('/', { replace: true })}
        >
          返回首页
        </button>
      </div>
    </main>
  )
}
