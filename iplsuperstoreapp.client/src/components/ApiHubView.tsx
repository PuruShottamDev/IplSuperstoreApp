import React, { useState } from 'react';
import { 
  Terminal, 
  Layers, 
  //Code2, 
  //Send, 
  Copy, 
  Check, 
  Globe, 
  Cpu, 
  Database, 
  Sparkles, 
  ArrowLeft 
} from 'lucide-react';
import type { AppRoute } from '../types';

interface ApiHubViewProps {
  setCurrentRoute: (route: AppRoute) => void;
  apiEndpoint: string;
  setApiEndpoint: (ep: string) => void;
  apiLatency: number | string;
  setApiLatency: (latency: number | string) => void;
  showToast: (msg: string) => void;
}


export const ApiHubView: React.FC<ApiHubViewProps> = ({
  setCurrentRoute,
  apiEndpoint,
  setApiEndpoint,
  apiLatency,
  setApiLatency,
  showToast,
}) => {
  const [activeTab, setActiveTab] = useState<'swagger' | 'architecture' | 'controller'>('swagger');
  const [selectedRoute, setSelectedRoute] = useState<string>('GET /api/products');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isPinging, setIsPinging] = useState<boolean>(false);

  const testPing = () => {
    setIsPinging(true);
    setTimeout(() => {
      const ms = Math.floor(18 + Math.random() * 15);
      setApiLatency(ms);
      setIsPinging(false);
      showToast(`Pinged ${apiEndpoint}: 200 OK (${ms}ms)`);
    }, 450);
  };

  const copyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    showToast('C# controller code copied to clipboard!');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const swaggerRoutes = [
    { method: 'GET', path: '/api/products', desc: 'Fetch products with search, franchise, category, and paging filters', status: '200 OK' },
    { method: 'GET', path: '/api/products/{id}', desc: 'Retrieve a single product for the detail view', status: '200 OK' },
    { method: 'GET', path: '/api/cart', desc: 'Load the authenticated customer cart', status: '200 OK' },
    { method: 'GET', path: '/api/orders', desc: 'Load the authenticated customer orders', status: '200 OK' },
    { method: 'POST', path: '/api/auth/login', desc: 'Authenticate the customer and return an access token', status: '200 OK' }
  ];

  const csharpCodeSnippet = `// IPLFanZone.Api/Controllers/ProductsController.cs
namespace IPLFanZone.Api.Controllers;

[ApiController]
[Route("api/products")]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class ProductsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<ProductsController> _logger;

    public ProductsController(IMediator mediator, ILogger<ProductsController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<ProductDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetProducts([FromQuery] string? franchise, [FromQuery] string? category, CancellationToken ct)
    {
        var query = new GetProductsQuery(franchise, category);
        var result = await _mediator.Send(query, ct);
        return Ok(result);
    }
}`;

  return (
    <main className="ipl-main-content">
      <div className="apihub-page-wrapper">
        
        {/* Header */}
        <div className="cart-title-row">
          <div className="cart-title-left">
            <div className="cart-title-icon-box" style={{ backgroundColor: '#4f46e5' }}>
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h1 className="cart-h1">Developer Hub & .NET 8 Web API</h1>
              <span className="cart-route-info">
                Route: /developer/api-hub • ASP.NET Core 8 Web API Microservice Spec
              </span>
            </div>
          </div>

          <button
            id="apihub-back-btn"
            onClick={() => setCurrentRoute('catalog')}
            className="cart-continue-link"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Storefront</span>
          </button>
        </div>

        {/* Live Endpoint Gateway Probe */}
        <div className="endpoint-probe-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#0f172a' }}>
              <Globe className="w-4 h-4" style={{ color: '#0b57d0' }} />
              <span>Gateway Base URL & Health Probe</span>
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', color: '#059669', fontWeight: 600 }}>
              Latency: {apiLatency}ms
            </span>
          </div>

          <div className="probe-input-row">
            <input
              id="api-gateway-url-input"
              type="text"
              value={apiEndpoint}
              onChange={(e) => setApiEndpoint(e.target.value)}
              className="probe-input"
            />
            <button
              id="btn-ping-api"
              onClick={testPing}
              disabled={isPinging}
              className="btn-probe-ping"
            >
              {isPinging ? 'Pinging...' : 'Ping Probe'}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="apihub-tabs-bar">
          <button
            id="tab-swagger-routes"
            onClick={() => setActiveTab('swagger')}
            className={`apihub-tab-btn ${activeTab === 'swagger' ? 'active' : ''}`}
          >
            OpenAPI / Swagger Spec
          </button>
          <button
            id="tab-clean-architecture"
            onClick={() => setActiveTab('architecture')}
            className={`apihub-tab-btn ${activeTab === 'architecture' ? 'active' : ''}`}
          >
            Clean Architecture
          </button>
          <button
            id="tab-csharp-controller"
            onClick={() => setActiveTab('controller')}
            className={`apihub-tab-btn ${activeTab === 'controller' ? 'active' : ''}`}
          >
            C# 12 / .NET 8 Controller
          </button>
        </div>

        {/* Tab 1: Swagger / OpenAPI */}
        {activeTab === 'swagger' && (
          <div className="swagger-routes-box">
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', display: 'flex', justifyContent: 'space-between' }}>
              <span>Registered HTTP Endpoints (v1.0.4)</span>
              <span style={{ color: '#0b57d0', fontFamily: 'var(--font-mono)' }}>OAS 3.0 Compliant</span>
            </div>

            {swaggerRoutes.map((rt) => {
              const isSelected = selectedRoute === `${rt.method} ${rt.path}`;
              return (
                <div
                  key={rt.path}
                  onClick={() => setSelectedRoute(`${rt.method} ${rt.path}`)}
                  className={`swagger-route-row ${isSelected ? 'selected' : ''}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontWeight: 700,
                      backgroundColor: rt.method === 'GET' ? '#059669' : '#0284c7',
                      color: '#ffffff',
                      fontSize: '10px'
                    }}>
                      {rt.method}
                    </span>
                    <strong style={{ color: '#0f172a' }}>{rt.path}</strong>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ color: '#64748b', fontSize: '11px', display: 'none' }}>{rt.desc}</span>
                    <span style={{ padding: '2px 6px', borderRadius: '4px', backgroundColor: '#e2e8f0', color: '#334155', fontSize: '11px' }}>
                      {rt.status}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        showToast(`Invoked simulated ${rt.method} ${rt.path}: 200 OK!`);
                      }}
                      style={{ padding: '4px 10px', borderRadius: '4px', backgroundColor: '#0b57d0', color: '#ffffff', fontSize: '11px', fontWeight: 600 }}
                    >
                      Try It
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Clean Architecture */}
        {activeTab === 'architecture' && (
          <div className="arch-cards-grid">
            <div className="arch-layer-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#4f46e5', marginBottom: '8px' }}>
                <Layers className="w-4 h-4" />
                <span>1. Web API Layer</span>
              </div>
              <p style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                Controllers, JWT HS256 auth filters, FluentValidation middleware, rate limiting, and CORS configuration.
              </p>
            </div>

            <div className="arch-layer-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#0284c7', marginBottom: '8px' }}>
                <Cpu className="w-4 h-4" />
                <span>2. Application</span>
              </div>
              <p style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                MediatR CQRS handlers, pipeline behaviors, caching decorators, and fan loyalty discount calculation services.
              </p>
            </div>

            <div className="arch-layer-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#059669', marginBottom: '8px' }}>
                <Sparkles className="w-4 h-4" />
                <span>3. Core Domain</span>
              </div>
              <p style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                Product entity, Franchise aggregates, Money value objects, HologramSignature and Order domain events.
              </p>
            </div>

            <div className="arch-layer-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#d97706', marginBottom: '8px' }}>
                <Database className="w-4 h-4" />
                <span>4. Infrastructure</span>
              </div>
              <p style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                Entity Framework Core, PostgreSQL 16 migrations, Redis distributed cache, BlueDart shipment carrier adapter.
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: C# 12 Controller Code Snippet */}
        {activeTab === 'controller' && (
          <div className="csharp-code-box">
            <button
              id="copy-csharp-code-btn"
              onClick={() => copyCode(csharpCodeSnippet)}
              className="btn-copy-code"
            >
              {isCopied ? <Check className="w-3.5 h-3.5" style={{ color: '#34d399' }} /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'Copied!' : 'Copy C# Code'}</span>
            </button>
            <pre style={{ margin: 0, padding: 0 }}>
              <code>{csharpCodeSnippet}</code>
            </pre>
          </div>
        )}

      </div>
    </main>
  );
};
