interface HeaderProps {
  sampleCount: number;
  quoteCount: number;
  matched: number;
  groupCount: number;
  planCount: number;
  onOpenQuote: () => void;
  onOpenPlan: () => void;
}

export function Header({
  sampleCount,
  quoteCount,
  matched,
  groupCount,
  planCount,
  onOpenQuote,
  onOpenPlan,
}: HeaderProps) {
  return (
    <header className="topbar">
      <a className="skip" href="#recommend">
        跳到推荐
      </a>
      <div className="brand">
        <span className="mark" aria-hidden="true">
          择
        </span>
        <div>
          <p className="eyebrow">客户演示</p>
          <h1>果择</h1>
          <p className="tagline">
            二手 Apple 笔记本多端比价。推荐优先给京东二手和爱回收。
          </p>
        </div>
      </div>
      <div className="top-side">
        <div className="header-actions">
          <button type="button" className="ghost" onClick={onOpenQuote}>
            录入报价
          </button>
          <button type="button" className="primary" onClick={onOpenPlan}>
            客户方案{planCount > 0 ? ` ${planCount}` : ''}
          </button>
        </div>
        <ul className="stats">
        <li>
          <strong>{sampleCount}</strong>
          <span>{quoteCount > 0 ? `在库 · 本场 ${quoteCount}` : '在库'}</span>
        </li>
        <li>
          <strong>5</strong>
          <span>比价渠道</span>
        </li>
        <li>
          <strong>{matched}</strong>
          <span>当前命中</span>
        </li>
        <li>
          <strong>{groupCount}</strong>
          <span>同配置组</span>
        </li>
      </ul>
      </div>
    </header>
  );
}
