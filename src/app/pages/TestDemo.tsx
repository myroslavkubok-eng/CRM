import { useSearchParams } from 'react-router-dom';

export function TestDemo() {
  const [searchParams] = useSearchParams();
  const isDemo = searchParams.get('demo') === 'true';

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Demo Test Page</h1>
        
        <div className="space-y-4">
          <div>
            <p className="text-gray-600">Current URL:</p>
            <p className="font-mono text-sm bg-gray-100 p-2 rounded">{window.location.href}</p>
          </div>

          <div>
            <p className="text-gray-600">Demo parameter:</p>
            <p className="font-mono text-sm bg-gray-100 p-2 rounded">
              {searchParams.get('demo') || 'null'}
            </p>
          </div>

          <div>
            <p className="text-gray-600">isDemo value:</p>
            <p className={`font-bold text-lg ${isDemo ? 'text-green-600' : 'text-red-600'}`}>
              {isDemo ? '✅ TRUE - Demo Mode Active' : '❌ FALSE - Normal Mode'}
            </p>
          </div>

          {isDemo && (
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-lg">
              <p className="font-medium text-center">
                🎨 Demo Mode Banner Test
              </p>
            </div>
          )}

          <div className="pt-4 border-t space-y-2">
            <a 
              href="/test-demo?demo=true" 
              className="block w-full text-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Test with ?demo=true
            </a>
            <a 
              href="/test-demo" 
              className="block w-full text-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Test without demo param
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
