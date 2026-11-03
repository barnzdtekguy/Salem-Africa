'use client';

import { useRef, useState } from 'react';
import { GIVING_ACCOUNTS, GIVING_FUNDS } from '@/data/giving';

type GivingPanel = 'support' | 'give';

export function GivingAccounts() {
  const [openPanel, setOpenPanel] = useState<GivingPanel | null>(null);
  const [copyStatus, setCopyStatus] = useState<Record<string, 'copied' | 'failed'>>({});
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  async function copyAccountNumber(purpose: string, accountNumber: string) {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('Clipboard access is unavailable in this browser.');
      }

      await navigator.clipboard.writeText(accountNumber);
      setCopyStatus((status) => ({ ...status, [purpose]: 'copied' }));
    } catch {
      setCopyStatus((status) => ({ ...status, [purpose]: 'failed' }));
      const input = inputRefs.current[purpose];
      input?.focus();
      input?.select();
    }
  }

  function togglePanel(panel: GivingPanel) {
    setOpenPanel((current) => (current === panel ? null : panel));
  }

  return (
    <section className="bg-paper py-16 sm:py-24" aria-labelledby="giving-heading">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="giving-heading" className="font-display text-3xl text-ink sm:text-4xl">
            Give &amp; Support
          </h2>
        </div>

        <div className="giving-accordion mt-10">
          <div className="giving-accordion-item">
            <button
              type="button"
              id="giving-support-trigger"
              aria-expanded={openPanel === 'support'}
              aria-controls="giving-support-panel"
              onClick={() => togglePanel('support')}
              className="giving-accordion-trigger"
            >
              Support
              <span className="giving-accordion-indicator" aria-hidden="true">
                {openPanel === 'support' ? '−' : '+'}
              </span>
            </button>
            <div
              id="giving-support-panel"
              role="region"
              aria-labelledby="giving-support-trigger"
              aria-hidden={openPanel !== 'support'}
              inert={openPanel !== 'support'}
              className={`giving-accordion-panel ${openPanel === 'support' ? 'is-open' : ''}`}
            >
              <div className="giving-accordion-panel-inner">
                <div className="giving-account-list">
                  {GIVING_ACCOUNTS.map((account) => {
                    const copied = copyStatus[account.purpose] === 'copied';
                    const failed = copyStatus[account.purpose] === 'failed';

                    return (
                      <article className="giving-account-row" key={account.purpose}>
                        <h3 className="giving-account-purpose">{account.purpose}</h3>
                        {account.accountNumber ? (
                          <>
                            <dl className="giving-account-details">
                              <div>
                                <dt>Bank</dt>
                                <dd>{account.bank}</dd>
                              </div>
                              <div>
                                <dt>Account name</dt>
                                <dd>{account.accountName}</dd>
                              </div>
                              <div>
                                <dt>Account number</dt>
                                <dd>
                                  <input
                                    ref={(element) => {
                                      inputRefs.current[account.purpose] = element;
                                    }}
                                    type="text"
                                    inputMode="numeric"
                                    readOnly
                                    aria-label={`${account.purpose} account number`}
                                    value={account.accountNumber}
                                    onFocus={(event) => event.currentTarget.select()}
                                    className="giving-account-number"
                                  />
                                </dd>
                              </div>
                            </dl>
                            <div className="giving-account-actions">
                              <button
                                type="button"
                                onClick={() => copyAccountNumber(account.purpose, account.accountNumber)}
                                className="giving-copy-button"
                              >
                                {copied ? 'Copied' : 'Copy Account Number'}
                              </button>
                              <p role="status" aria-live="polite" className="giving-copy-status">
                                {failed
                                  ? 'Could not copy. The number is selected for you to copy manually.'
                                  : copied
                                    ? 'Copied'
                                    : ''}
                              </p>
                              {account.paymentUrl && (
                                <a
                                  href={account.paymentUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="giving-card-payment"
                                >
                                  Pay with Card
                                </a>
                              )}
                            </div>
                          </>
                        ) : (
                          <p className="giving-coming-soon">Coming soon</p>
                        )}
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="giving-accordion-item">
            <button
              type="button"
              id="giving-give-trigger"
              aria-expanded={openPanel === 'give'}
              aria-controls="giving-give-panel"
              onClick={() => togglePanel('give')}
              className="giving-accordion-trigger"
            >
              Give
              <span className="giving-accordion-indicator" aria-hidden="true">
                {openPanel === 'give' ? '−' : '+'}
              </span>
            </button>
            <div
              id="giving-give-panel"
              role="region"
              aria-labelledby="giving-give-trigger"
              aria-hidden={openPanel !== 'give'}
              inert={openPanel !== 'give'}
              className={`giving-accordion-panel ${openPanel === 'give' ? 'is-open' : ''}`}
            >
              <div className="giving-accordion-panel-inner">
                <div className="giving-fund-list">
                  {GIVING_FUNDS.map((fund) => {
                    const account = fund.account;

                    return (
                      <article className="giving-fund-row" key={fund.purpose}>
                        <h3 className="giving-account-purpose">{fund.purpose}</h3>
                        {account ? (
                          <div className="giving-fund-details">
                            <dl className="giving-account-details giving-fund-account-details">
                              <div>
                                <dt>Bank</dt>
                                <dd>{account.bank}</dd>
                              </div>
                              <div>
                                <dt>Account name</dt>
                                <dd>{account.accountName}</dd>
                              </div>
                              <div>
                                <dt>Account number</dt>
                                <dd>
                                  <input
                                    ref={(element) => {
                                      inputRefs.current[fund.purpose] = element;
                                    }}
                                    type="text"
                                    inputMode="numeric"
                                    readOnly
                                    aria-label={`${fund.purpose} account number`}
                                    value={account.accountNumber}
                                    onFocus={(event) => event.currentTarget.select()}
                                    className="giving-account-number"
                                  />
                                </dd>
                              </div>
                            </dl>
                            <div className="giving-account-actions">
                              <button
                                type="button"
                                onClick={() =>
                                  copyAccountNumber(fund.purpose, account.accountNumber)
                                }
                                className="giving-copy-button"
                              >
                                {copyStatus[fund.purpose] === 'copied'
                                  ? 'Copied'
                                  : 'Copy Account Number'}
                              </button>
                              <p role="status" aria-live="polite" className="giving-copy-status">
                                {copyStatus[fund.purpose] === 'failed'
                                  ? 'Could not copy. The number is selected for you to copy manually.'
                                  : copyStatus[fund.purpose] === 'copied'
                                    ? 'Copied'
                                    : ''}
                              </p>
                            </div>
                            {fund.paymentUrl && (
                              <a
                                href={fund.paymentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="giving-card-payment"
                              >
                                Pay with Card
                              </a>
                            )}
                          </div>
                        ) : (
                          <p className="giving-coming-soon">Coming soon</p>
                        )}
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
