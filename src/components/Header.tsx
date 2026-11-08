interface HeaderProps {
  sampleCount: number;
  matched: number;
  groupCount: number;
}

export function Header({ sampleCount, matched, groupCount }: HeaderProps) {
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
          <p className="eyebrow">客户演示 · 四渠道同屏</p>
          <h1>果择</h1>
          <p className="tagline">
            二手 Apple 笔记本多端比价。按成新度和金额，从京东拍拍、全网、主播挂价、闲鱼里挑出更合适的几台。
          </p>
        </div>
      </div>
      <ul className="stats">
        <li>
          <strong>{sampleCount}</strong>
          <span>演示样本</span>
        </li>
        <li>
          <strong>4</strong>
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
    </header>
  );
}
