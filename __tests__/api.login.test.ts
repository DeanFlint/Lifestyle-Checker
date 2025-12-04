/** @jest-environment node */
import { GET } from '../src/app/api/login/route'

const originalEnv = { ...process.env }
const originalFetch = global.fetch

beforeEach(() => {
  jest.clearAllMocks()
  process.env = { ...originalEnv }
  if (originalFetch) {
    global.fetch = originalFetch
  }
})

afterAll(() => {
  process.env = originalEnv
  if (originalFetch) {
    global.fetch = originalFetch
  }
})

describe('GET /api/login', () => {
  it('returns 400 when nhsnum is missing', async () => {
    const response = await GET(new Request('http://localhost/api/login'))
    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({ error: 'nhsnum is required' })
  })

  it('calls upstream with encoded nhsnum and returns payload on success', async () => {
    const payload = { nhsnumber: '123 456 7890', name: 'Doe, Jane', born: '01-01-1990' }
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(payload),
    } as unknown as Response)

    process.env.API_BASE_URL = 'https://example.com/patients'
    process.env.API_KEY = 'secret-key'
    global.fetch = fetchMock as unknown as typeof fetch

    const response = await GET(new Request('http://localhost/api/login?nhsnum=123 456 7890'))

    expect(fetchMock).toHaveBeenCalledWith(
      'https://example.com/patients/123%20456%207890',
      {
        headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': 'secret-key',
        },
      },
    )
    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual(payload)
  })

  it('propagates upstream error status and message', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ message: 'Invalid NHS number' }),
    } as unknown as Response)

    process.env.API_BASE_URL = 'https://example.com/patients'
    global.fetch = fetchMock as unknown as typeof fetch

    const response = await GET(new Request('http://localhost/api/login?nhsnum=999'))

    expect(response.status).toBe(401)
    await expect(response.json()).resolves.toEqual({ error: 'Invalid NHS number' })
  })
})
