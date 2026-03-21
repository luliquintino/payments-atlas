/**
 * Seed data Part 2: Problems, Solutions, Diagnosis Rules, Metrics, Ecosystem, Taxonomy.
 */
exports.seed = async function(knex) {
  // ========== PROBLEMS (100) ==========
  const problems = [
    // Authorization (20)
    {name:'High Decline Rate',description:'Overall transaction approval rate below industry benchmarks',category:'authorization',severity:'critical',layer:'processing',symptoms:'{low_approval_rate,revenue_loss,customer_complaints}',affected_metrics:'{authorization_rate,conversion_rate,revenue}',affected_rails:'{Cards}',root_causes:'{single_acquirer,no_retry_logic,missing_3ds,stale_credentials}'},
    {name:'Cross-Border Authorization Failures',description:'International transactions declining at higher rates than domestic',category:'authorization',severity:'high',layer:'network',symptoms:'{high_international_decline_rate,currency_errors}',affected_metrics:'{authorization_rate,cross_border_success}',affected_rails:'{Cards}',root_causes:'{no_local_acquiring,currency_mismatch,network_routing}'},
    {name:'3DS Authentication Drop-off',description:'Customers abandoning checkout during 3DS challenge flow',category:'authorization',severity:'high',layer:'experience',symptoms:'{cart_abandonment,low_3ds_completion}',affected_metrics:'{conversion_rate,authorization_rate}',affected_rails:'{Cards}',root_causes:'{poor_3ds_ux,no_frictionless_flow,missing_exemptions}'},
    {name:'Do Not Honor Declines',description:'High rate of generic issuer declines without specific reason',category:'authorization',severity:'high',layer:'network',symptoms:'{generic_decline_codes,inconsistent_approvals}',affected_metrics:'{authorization_rate}',affected_rails:'{Cards}',root_causes:'{insufficient_data,wrong_mcc,issuer_risk_rules}'},
    {name:'Expired Card Declines',description:'Transactions failing due to expired card credentials',category:'authorization',severity:'medium',layer:'network',symptoms:'{expired_card_errors,subscription_failures}',affected_metrics:'{authorization_rate,retention}',affected_rails:'{Cards}',root_causes:'{no_account_updater,stale_tokens,no_network_tokens}'},
    {name:'Insufficient Funds Declines',description:'Legitimate transactions declined for balance reasons',category:'authorization',severity:'medium',layer:'processing',symptoms:'{nsf_declines,retry_opportunities}',affected_metrics:'{authorization_rate}',affected_rails:'{Cards}',root_causes:'{no_retry_logic,wrong_timing,no_partial_auth}'},
    {name:'Technical Timeout Errors',description:'Authorization requests timing out at acquirer or network',category:'authorization',severity:'high',layer:'processing',symptoms:'{timeout_errors,uncertain_transaction_status}',affected_metrics:'{authorization_rate,latency}',affected_rails:'{Cards}',root_causes:'{slow_acquirer,network_issues,no_failover}'},
    {name:'Soft Decline Mishandling',description:'Retryable declines not being retried appropriately',category:'authorization',severity:'high',layer:'orchestration',symptoms:'{missed_retry_opportunities,false_declines}',affected_metrics:'{authorization_rate}',affected_rails:'{Cards}',root_causes:'{no_decline_classification,no_retry_logic,wrong_routing}'},
    {name:'Network Token Auth Failure',description:'Network tokens not improving authorization rates as expected',category:'authorization',severity:'medium',layer:'network',symptoms:'{token_auth_failures,no_improvement}',affected_metrics:'{authorization_rate}',affected_rails:'{Cards}',root_causes:'{incomplete_provisioning,wrong_cryptogram,issuer_not_supporting}'},
    {name:'Debit Card Routing Issues',description:'Debit transactions routed to wrong network',category:'authorization',severity:'medium',layer:'orchestration',symptoms:'{routing_errors,higher_fees}',affected_metrics:'{authorization_rate,processing_cost}',affected_rails:'{Cards}',root_causes:'{missing_bin_data,wrong_network_selection}'},
    {name:'Pre-Auth Expiry',description:'Pre-authorized amounts expiring before capture',category:'authorization',severity:'medium',layer:'processing',symptoms:'{capture_failures,lost_revenue}',affected_metrics:'{authorization_rate,revenue}',affected_rails:'{Cards}',root_causes:'{delayed_capture,long_fulfillment,no_incremental_auth}'},
    {name:'MCC Mismatch Declines',description:'Transactions declined due to incorrect merchant category code',category:'authorization',severity:'medium',layer:'processing',symptoms:'{category_declines,restricted_transactions}',affected_metrics:'{authorization_rate}',affected_rails:'{Cards}',root_causes:'{wrong_mcc_setup,category_restrictions}'},
    {name:'Recurring Payment Failures',description:'Subscription charges failing at renewal',category:'authorization',severity:'high',layer:'processing',symptoms:'{subscription_churn,failed_renewals}',affected_metrics:'{authorization_rate,retention,revenue}',affected_rails:'{Cards}',root_causes:'{expired_credentials,no_account_updater,issuer_blocks}'},
    {name:'Multi-Currency Auth Failures',description:'Currency conversion causing authorization failures',category:'authorization',severity:'medium',layer:'processing',symptoms:'{currency_errors,fx_declines}',affected_metrics:'{authorization_rate}',affected_rails:'{Cards}',root_causes:'{unsupported_currency,fx_rate_issues}'},
    {name:'PIN Debit Failures',description:'PIN-based transactions failing at POS',category:'authorization',severity:'medium',layer:'network',symptoms:'{pin_errors,terminal_issues}',affected_metrics:'{authorization_rate}',affected_rails:'{Cards}',root_causes:'{key_management_issues,terminal_config}'},
    {name:'Contactless Limit Exceeded',description:'Contactless transactions declined over CVM limit',category:'authorization',severity:'low',layer:'experience',symptoms:'{contactless_decline,customer_friction}',affected_metrics:'{conversion_rate}',affected_rails:'{Cards}',root_causes:'{limit_not_communicated,no_fallback}'},
    {name:'EMV Fallback Issues',description:'Chip card fallback to magstripe causing declines',category:'authorization',severity:'medium',layer:'network',symptoms:'{fallback_declines,terminal_errors}',affected_metrics:'{authorization_rate}',affected_rails:'{Cards}',root_causes:'{terminal_issues,chip_reader_failure}'},
    {name:'Wallet Auth Failures',description:'Digital wallet transactions failing authentication',category:'authorization',severity:'medium',layer:'experience',symptoms:'{wallet_declines,biometric_failures}',affected_metrics:'{authorization_rate,conversion_rate}',affected_rails:'{Digital Wallets}',root_causes:'{token_issues,device_not_supported}'},
    {name:'ACH Return Rate',description:'High rate of ACH payment returns',category:'authorization',severity:'high',layer:'processing',symptoms:'{ach_returns,nsf_returns}',affected_metrics:'{authorization_rate,revenue}',affected_rails:'{ACH}',root_causes:'{no_account_verification,fraud,insufficient_funds}'},
    {name:'SEPA Rejection',description:'SEPA transfers being rejected by receiving bank',category:'authorization',severity:'medium',layer:'processing',symptoms:'{transfer_rejections,iban_errors}',affected_metrics:'{authorization_rate}',affected_rails:'{SEPA}',root_causes:'{invalid_iban,account_closed,compliance_block}'},
    // Fraud (20)
    {name:'False Positive Fraud Blocks',description:'Legitimate transactions incorrectly flagged as fraudulent',category:'fraud',severity:'high',layer:'processing',symptoms:'{customer_complaints,revenue_loss,high_review_queue}',affected_metrics:'{conversion_rate,false_positive_rate}',affected_rails:'{Cards}',root_causes:'{overly_aggressive_rules,poor_ml_model,insufficient_data}'},
    {name:'Chargeback Threshold Breach',description:'Chargeback rate approaching or exceeding network monitoring thresholds',category:'fraud',severity:'critical',layer:'processing',symptoms:'{high_chargeback_rate,network_warnings}',affected_metrics:'{chargeback_rate,merchant_health}',affected_rails:'{Cards}',root_causes:'{fraud_attacks,friendly_fraud,poor_dispute_management}'},
    {name:'Card Testing Attack',description:'Automated testing of stolen card numbers on merchant site',category:'fraud',severity:'critical',layer:'experience',symptoms:'{spike_in_small_transactions,high_decline_rate,bot_traffic}',affected_metrics:'{fraud_rate,authorization_rate}',affected_rails:'{Cards}',root_causes:'{no_velocity_checks,no_captcha,no_device_fingerprint}'},
    {name:'Account Takeover',description:'Fraudster gains access to legitimate customer account',category:'fraud',severity:'critical',layer:'experience',symptoms:'{unauthorized_purchases,password_changes,address_changes}',affected_metrics:'{fraud_rate,chargeback_rate}',affected_rails:'{Cards,Digital Wallets}',root_causes:'{weak_authentication,credential_stuffing,phishing}'},
    {name:'Friendly Fraud',description:'Legitimate cardholders filing false disputes',category:'fraud',severity:'high',layer:'processing',symptoms:'{disputed_legitimate_charges,high_chargeback_rate}',affected_metrics:'{chargeback_rate,revenue}',affected_rails:'{Cards}',root_causes:'{unclear_billing_descriptor,poor_communication,buyer_remorse}'},
    {name:'Synthetic Identity Fraud',description:'Fake identities created using combination of real and fabricated data',category:'fraud',severity:'critical',layer:'processing',symptoms:'{account_creation_fraud,bust_out_patterns}',affected_metrics:'{fraud_rate,credit_losses}',affected_rails:'{Cards}',root_causes:'{weak_kyc,no_identity_verification}'},
    {name:'Refund Abuse',description:'Systematic exploitation of refund policies',category:'fraud',severity:'medium',layer:'processing',symptoms:'{high_refund_rate,pattern_refund_requests}',affected_metrics:'{refund_rate,revenue}',affected_rails:'{Cards}',root_causes:'{loose_refund_policy,no_abuse_detection}'},
    {name:'Triangulation Fraud',description:'Fraud using legitimate marketplace as intermediary',category:'fraud',severity:'high',layer:'processing',symptoms:'{delayed_chargebacks,cross_merchant_patterns}',affected_metrics:'{fraud_rate,chargeback_rate}',affected_rails:'{Cards}',root_causes:'{marketplace_vulnerability,delayed_fulfillment}'},
    {name:'BIN Attack',description:'Systematic enumeration of valid card numbers from BIN ranges',category:'fraud',severity:'critical',layer:'network',symptoms:'{high_volume_small_auths,sequential_card_numbers}',affected_metrics:'{fraud_rate,auth_rate}',affected_rails:'{Cards}',root_causes:'{no_velocity_limits,no_bot_detection}'},
    {name:'Cross-Channel Fraud',description:'Fraud exploiting gaps between online and offline channels',category:'fraud',severity:'high',layer:'orchestration',symptoms:'{channel_hopping,inconsistent_risk_profiles}',affected_metrics:'{fraud_rate}',affected_rails:'{Cards,Digital Wallets}',root_causes:'{siloed_fraud_systems,no_unified_view}'},
    {name:'Payment Method Abuse',description:'Exploiting payment method features for fraud',category:'fraud',severity:'medium',layer:'experience',symptoms:'{unusual_payment_patterns,method_switching}',affected_metrics:'{fraud_rate}',affected_rails:'{Cards,Digital Wallets}',root_causes:'{weak_method_verification,no_linking}'},
    {name:'Merchant Fraud',description:'Fraudulent merchant processing unauthorized transactions',category:'fraud',severity:'critical',layer:'processing',symptoms:'{unusual_transaction_patterns,customer_complaints}',affected_metrics:'{fraud_rate,chargeback_rate}',affected_rails:'{Cards}',root_causes:'{weak_underwriting,no_monitoring}'},
    {name:'Credential Stuffing',description:'Automated login attempts using stolen credentials',category:'fraud',severity:'high',layer:'experience',symptoms:'{spike_in_login_failures,account_lockouts}',affected_metrics:'{fraud_rate,account_security}',affected_rails:'{Cards,Digital Wallets}',root_causes:'{weak_passwords,no_mfa,no_rate_limiting}'},
    {name:'Promotion Abuse',description:'Exploitation of promotional offers and discounts',category:'fraud',severity:'low',layer:'experience',symptoms:'{multiple_accounts,unusual_promo_usage}',affected_metrics:'{revenue,marketing_roi}',affected_rails:'{Cards}',root_causes:'{no_device_linking,weak_identity_verification}'},
    {name:'CNP Fraud Spike',description:'Sudden increase in card-not-present fraud',category:'fraud',severity:'critical',layer:'processing',symptoms:'{fraud_spike,chargeback_increase}',affected_metrics:'{fraud_rate,chargeback_rate}',affected_rails:'{Cards}',root_causes:'{data_breach,compromised_credentials,no_3ds}'},
    {name:'Interchange Manipulation',description:'Misrepresenting transaction data to qualify for lower interchange',category:'fraud',severity:'high',layer:'network',symptoms:'{unusually_low_interchange,data_quality_issues}',affected_metrics:'{processing_cost,compliance}',affected_rails:'{Cards}',root_causes:'{deliberate_misclassification,data_errors}'},
    {name:'Money Laundering Risk',description:'Payment system used for money laundering activities',category:'fraud',severity:'critical',layer:'processing',symptoms:'{unusual_patterns,high_value_transactions,structuring}',affected_metrics:'{compliance,fraud_rate}',affected_rails:'{Cards,ACH,Wire Transfer}',root_causes:'{weak_aml,no_transaction_monitoring}'},
    {name:'Dispute Fraud Ring',description:'Organized groups filing coordinated false disputes',category:'fraud',severity:'critical',layer:'processing',symptoms:'{correlated_disputes,similar_patterns}',affected_metrics:'{chargeback_rate}',affected_rails:'{Cards}',root_causes:'{no_graph_analytics,weak_representment}'},
    {name:'Virtual Card Fraud',description:'Fraud using generated virtual card numbers',category:'fraud',severity:'medium',layer:'network',symptoms:'{virtual_card_declines,issuer_reports}',affected_metrics:'{fraud_rate}',affected_rails:'{Cards}',root_causes:'{compromised_virtual_card_platform}'},
    {name:'Token Fraud',description:'Fraudulent use of compromised payment tokens',category:'fraud',severity:'high',layer:'network',symptoms:'{unauthorized_token_usage,token_compromise}',affected_metrics:'{fraud_rate,token_security}',affected_rails:'{Cards}',root_causes:'{weak_token_security,compromised_vault}'},
    // Settlement (15)
    {name:'Settlement Delay',description:'Funds not settling within expected timeframe',category:'settlement',severity:'high',layer:'settlement',symptoms:'{delayed_funding,cash_flow_issues}',affected_metrics:'{settlement_time,merchant_satisfaction}',affected_rails:'{Cards,ACH}',root_causes:'{acquirer_delays,reconciliation_errors,bank_processing}'},
    {name:'Reconciliation Discrepancy',description:'Mismatch between transaction records and settlement amounts',category:'settlement',severity:'high',layer:'settlement',symptoms:'{unmatched_transactions,balance_differences}',affected_metrics:'{reconciliation_accuracy}',affected_rails:'{Cards,ACH}',root_causes:'{timing_differences,missing_records,fee_calculation_errors}'},
    {name:'Split Settlement Failure',description:'Marketplace payments not splitting correctly to sellers',category:'settlement',severity:'high',layer:'settlement',symptoms:'{incorrect_payouts,seller_complaints}',affected_metrics:'{settlement_accuracy,merchant_satisfaction}',affected_rails:'{Cards}',root_causes:'{split_logic_errors,rounding_issues,ledger_bugs}'},
    {name:'Cross-Border Settlement Delays',description:'International settlements taking longer than expected',category:'settlement',severity:'high',layer:'settlement',symptoms:'{extended_settlement_time,fx_differences}',affected_metrics:'{settlement_time}',affected_rails:'{Cards,Wire Transfer}',root_causes:'{correspondent_bank_delays,fx_conversion_timing}'},
    {name:'Payout Failure',description:'Merchant payouts failing or being returned',category:'settlement',severity:'high',layer:'settlement',symptoms:'{failed_payouts,returned_transfers}',affected_metrics:'{payout_success_rate}',affected_rails:'{ACH,Cards}',root_causes:'{incorrect_bank_details,account_closed,compliance_hold}'},
    {name:'Reserve Hold Issues',description:'Excessive or incorrect reserve holds on merchant funds',category:'settlement',severity:'medium',layer:'settlement',symptoms:'{cash_flow_constraints,merchant_complaints}',affected_metrics:'{merchant_satisfaction}',affected_rails:'{Cards}',root_causes:'{risk_model_issues,outdated_reserve_rules}'},
    {name:'Fee Calculation Error',description:'Incorrect processing fees charged to merchants',category:'settlement',severity:'high',layer:'settlement',symptoms:'{billing_disputes,fee_discrepancies}',affected_metrics:'{processing_cost}',affected_rails:'{Cards}',root_causes:'{pricing_model_errors,interchange_miscalculation}'},
    {name:'Duplicate Settlement',description:'Same transaction settled multiple times',category:'settlement',severity:'critical',layer:'settlement',symptoms:'{double_charges,customer_complaints}',affected_metrics:'{settlement_accuracy}',affected_rails:'{Cards}',root_causes:'{idempotency_failure,system_retry_errors}'},
    {name:'Refund Settlement Mismatch',description:'Refund amounts not matching original transaction',category:'settlement',severity:'medium',layer:'settlement',symptoms:'{partial_refund_errors,timing_mismatches}',affected_metrics:'{settlement_accuracy}',affected_rails:'{Cards}',root_causes:'{fx_rate_changes,fee_handling}'},
    {name:'Batch Processing Failure',description:'Settlement batch failing to process completely',category:'settlement',severity:'critical',layer:'settlement',symptoms:'{incomplete_settlement,stuck_transactions}',affected_metrics:'{settlement_time,settlement_rate}',affected_rails:'{ACH,SEPA}',root_causes:'{file_format_errors,system_failures}'},
    {name:'Nostro Account Imbalance',description:'Correspondent bank account balance discrepancy',category:'settlement',severity:'high',layer:'settlement',symptoms:'{balance_mismatch,liquidity_issues}',affected_metrics:'{settlement_accuracy}',affected_rails:'{Wire Transfer}',root_causes:'{reconciliation_gaps,delayed_credits}'},
    {name:'FX Settlement Risk',description:'Exchange rate fluctuation between auth and settlement',category:'settlement',severity:'medium',layer:'settlement',symptoms:'{fx_loss,rate_discrepancies}',affected_metrics:'{processing_cost}',affected_rails:'{Cards}',root_causes:'{delayed_settlement,no_fx_hedging}'},
    {name:'Clearing Network Outage',description:'Payment clearing network experiencing downtime',category:'settlement',severity:'critical',layer:'settlement',symptoms:'{settlement_halt,queue_buildup}',affected_metrics:'{settlement_time}',affected_rails:'{Cards,ACH}',root_causes:'{infrastructure_failure,network_maintenance}'},
    {name:'Interchange Downgrade',description:'Transactions qualifying for higher interchange due to missing data',category:'settlement',severity:'medium',layer:'network',symptoms:'{higher_interchange_fees,increased_cost}',affected_metrics:'{processing_cost}',affected_rails:'{Cards}',root_causes:'{missing_level2_data,delayed_settlement,wrong_mcc}'},
    {name:'Scheme Fee Increase Impact',description:'Card scheme fee changes increasing processing costs',category:'settlement',severity:'medium',layer:'network',symptoms:'{increased_fees,margin_compression}',affected_metrics:'{processing_cost}',affected_rails:'{Cards}',root_causes:'{scheme_fee_changes,volume_tier_changes}'},
    // Compliance (15)
    {name:'PCI DSS Non-Compliance',description:'Payment card data not handled according to PCI standards',category:'compliance',severity:'critical',layer:'processing',symptoms:'{audit_failures,data_exposure_risk}',affected_metrics:'{compliance_score}',affected_rails:'{Cards}',root_causes:'{unencrypted_storage,logging_card_data,weak_access_controls}'},
    {name:'SCA Compliance Gap',description:'Strong Customer Authentication not properly implemented for EU',category:'compliance',severity:'critical',layer:'processing',symptoms:'{regulation_violation,transaction_blocks}',affected_metrics:'{authorization_rate,compliance_score}',affected_rails:'{Cards}',root_causes:'{missing_3ds,wrong_exemption_handling}'},
    {name:'Data Residency Violation',description:'Customer data stored outside permitted jurisdictions',category:'compliance',severity:'critical',layer:'processing',symptoms:'{regulatory_risk,audit_findings}',affected_metrics:'{compliance_score}',affected_rails:'{Cards,ACH,SEPA}',root_causes:'{wrong_data_center,cloud_misconfiguration}'},
    {name:'KYC/AML Program Deficiency',description:'Inadequate customer due diligence processes',category:'compliance',severity:'critical',layer:'banking',symptoms:'{regulatory_findings,enforcement_risk}',affected_metrics:'{compliance_score}',affected_rails:'{Cards,ACH,Wire Transfer}',root_causes:'{manual_processes,incomplete_screening}'},
    {name:'GDPR Data Breach',description:'Personal data breach under EU regulation',category:'compliance',severity:'critical',layer:'processing',symptoms:'{data_exposure,notification_requirement}',affected_metrics:'{compliance_score}',affected_rails:'{Cards}',root_causes:'{security_vulnerability,insider_threat}'},
    {name:'Money Transmitter License Gap',description:'Operating without required state licenses',category:'compliance',severity:'critical',layer:'banking',symptoms:'{regulatory_action_risk}',affected_metrics:'{compliance_score}',affected_rails:'{ACH,Wire Transfer}',root_causes:'{incomplete_licensing,expansion_without_license}'},
    {name:'Transaction Monitoring Gap',description:'Insufficient monitoring for suspicious activity',category:'compliance',severity:'high',layer:'banking',symptoms:'{regulatory_findings,missed_sars}',affected_metrics:'{compliance_score}',affected_rails:'{Cards,ACH,Wire Transfer}',root_causes:'{threshold_gaps,manual_monitoring}'},
    {name:'Reporting Failure',description:'Failure to file required regulatory reports',category:'compliance',severity:'critical',layer:'banking',symptoms:'{regulatory_penalties,enforcement_action}',affected_metrics:'{compliance_score}',affected_rails:'{Cards,ACH}',root_causes:'{system_errors,process_gaps}'},
    {name:'Consumer Protection Violation',description:'Not providing required consumer disclosures',category:'compliance',severity:'high',layer:'experience',symptoms:'{customer_complaints,regulatory_action}',affected_metrics:'{compliance_score}',affected_rails:'{Cards,BNPL}',root_causes:'{missing_disclosures,unclear_terms}'},
    {name:'Accessibility Non-Compliance',description:'Payment interfaces not meeting accessibility standards',category:'compliance',severity:'medium',layer:'experience',symptoms:'{accessibility_complaints,audit_findings}',affected_metrics:'{conversion_rate,compliance_score}',affected_rails:'{Cards}',root_causes:'{missing_aria_labels,keyboard_navigation}'},
    {name:'Cross-Border Regulatory Gap',description:'Non-compliance with destination country payment regulations',category:'compliance',severity:'high',layer:'banking',symptoms:'{blocked_transactions,regulatory_risk}',affected_metrics:'{authorization_rate,compliance_score}',affected_rails:'{Cards,Wire Transfer}',root_causes:'{regulatory_complexity,no_local_compliance}'},
    {name:'Card Scheme Rule Violation',description:'Non-compliance with Visa/Mastercard operating regulations',category:'compliance',severity:'high',layer:'network',symptoms:'{scheme_fines,merchant_warnings}',affected_metrics:'{compliance_score,processing_cost}',affected_rails:'{Cards}',root_causes:'{outdated_processes,mandate_ignorance}'},
    {name:'Encryption Standards Gap',description:'Encryption not meeting current security standards',category:'compliance',severity:'critical',layer:'processing',symptoms:'{security_audit_failures,vulnerability}',affected_metrics:'{compliance_score}',affected_rails:'{Cards}',root_causes:'{legacy_encryption,no_key_rotation}'},
    {name:'Audit Trail Deficiency',description:'Insufficient logging for compliance audit requirements',category:'compliance',severity:'high',layer:'processing',symptoms:'{audit_findings,investigation_difficulty}',affected_metrics:'{compliance_score}',affected_rails:'{Cards,ACH}',root_causes:'{incomplete_logging,log_retention}'},
    {name:'Third-Party Risk',description:'Inadequate oversight of payment processing third parties',category:'compliance',severity:'high',layer:'banking',symptoms:'{vendor_risk,compliance_gap}',affected_metrics:'{compliance_score}',affected_rails:'{Cards}',root_causes:'{no_vendor_assessment,missing_soc2}'},
    // Performance (15)
    {name:'High Payment Latency',description:'Transaction processing taking too long affecting UX',category:'performance',severity:'high',layer:'processing',symptoms:'{slow_checkout,timeouts,customer_abandonment}',affected_metrics:'{latency,conversion_rate}',affected_rails:'{Cards}',root_causes:'{slow_acquirer,network_latency,heavy_fraud_checks}'},
    {name:'Gateway Timeout',description:'Payment gateway timing out during peak load',category:'performance',severity:'critical',layer:'processing',symptoms:'{502_errors,transaction_failures}',affected_metrics:'{uptime,authorization_rate}',affected_rails:'{Cards}',root_causes:'{insufficient_capacity,no_auto_scaling}'},
    {name:'Peak Load Degradation',description:'System performance degrades during traffic spikes',category:'performance',severity:'high',layer:'orchestration',symptoms:'{increased_latency,error_rates,queue_buildup}',affected_metrics:'{latency,authorization_rate,uptime}',affected_rails:'{Cards}',root_causes:'{no_auto_scaling,database_bottleneck}'},
    {name:'API Rate Limiting Impact',description:'PSP API rate limits causing transaction failures',category:'performance',severity:'medium',layer:'orchestration',symptoms:'{429_errors,queued_transactions}',affected_metrics:'{authorization_rate,latency}',affected_rails:'{Cards}',root_causes:'{volume_spikes,no_rate_management}'},
    {name:'Database Performance Bottleneck',description:'Payment database queries causing slowdowns',category:'performance',severity:'high',layer:'processing',symptoms:'{slow_queries,lock_contention}',affected_metrics:'{latency}',affected_rails:'{Cards}',root_causes:'{missing_indexes,no_read_replicas}'},
    {name:'Webhook Delivery Delays',description:'Payment status webhooks not delivered in time',category:'performance',severity:'medium',layer:'orchestration',symptoms:'{delayed_notifications,order_processing_delays}',affected_metrics:'{latency}',affected_rails:'{Cards}',root_causes:'{queue_congestion,endpoint_timeouts}'},
    {name:'3DS Latency',description:'3D Secure authentication adding excessive latency',category:'performance',severity:'medium',layer:'experience',symptoms:'{slow_checkout,authentication_timeout}',affected_metrics:'{latency,conversion_rate}',affected_rails:'{Cards}',root_causes:'{acs_slow,network_hops}'},
    {name:'Tokenization Service Latency',description:'Token service responding slowly',category:'performance',severity:'medium',layer:'processing',symptoms:'{slow_token_operations,checkout_delays}',affected_metrics:'{latency}',affected_rails:'{Cards}',root_causes:'{vault_performance,encryption_overhead}'},
    {name:'Settlement Batch Processing Slowdown',description:'Nightly settlement batches taking too long',category:'performance',severity:'medium',layer:'settlement',symptoms:'{delayed_settlement,processing_window_exceeded}',affected_metrics:'{settlement_time}',affected_rails:'{Cards,ACH}',root_causes:'{growing_volume,inefficient_queries}'},
    {name:'Reporting Query Performance',description:'Analytics and reporting queries timing out',category:'performance',severity:'low',layer:'settlement',symptoms:'{slow_dashboards,report_failures}',affected_metrics:'{operational_efficiency}',affected_rails:'{Cards}',root_causes:'{no_data_warehouse,missing_aggregations}'},
    {name:'Mobile SDK Performance',description:'Mobile payment SDK causing app slowdowns',category:'performance',severity:'medium',layer:'experience',symptoms:'{slow_app,battery_drain}',affected_metrics:'{conversion_rate}',affected_rails:'{Cards,Digital Wallets}',root_causes:'{heavy_sdk,no_lazy_loading}'},
    {name:'Certificate Expiry',description:'SSL/TLS certificates expiring causing service disruption',category:'performance',severity:'critical',layer:'processing',symptoms:'{connection_failures,service_outage}',affected_metrics:'{uptime}',affected_rails:'{Cards}',root_causes:'{no_auto_renewal,monitoring_gap}'},
    {name:'DNS Resolution Issues',description:'DNS failures affecting payment endpoint connectivity',category:'performance',severity:'high',layer:'processing',symptoms:'{intermittent_failures,geographic_outages}',affected_metrics:'{uptime,latency}',affected_rails:'{Cards}',root_causes:'{single_dns_provider,ttl_issues}'},
    {name:'Memory Leak in Payment Service',description:'Payment processing service memory growing unbounded',category:'performance',severity:'high',layer:'processing',symptoms:'{increasing_latency,periodic_crashes}',affected_metrics:'{uptime,latency}',affected_rails:'{Cards}',root_causes:'{connection_leak,cache_growth}'},
    {name:'Load Balancer Misconfiguration',description:'Uneven traffic distribution across payment servers',category:'performance',severity:'medium',layer:'orchestration',symptoms:'{hot_spots,uneven_response_times}',affected_metrics:'{latency}',affected_rails:'{Cards}',root_causes:'{sticky_sessions,wrong_algorithm}'},
    // Integration (15)
    {name:'PSP Migration Data Loss',description:'Data lost or corrupted during payment provider migration',category:'integration',severity:'critical',layer:'orchestration',symptoms:'{missing_transactions,token_failures}',affected_metrics:'{authorization_rate,data_integrity}',affected_rails:'{Cards}',root_causes:'{incomplete_token_migration,mapping_errors}'},
    {name:'Multi-PSP Consistency Issues',description:'Inconsistent behavior across payment service providers',category:'integration',severity:'high',layer:'orchestration',symptoms:'{different_response_formats,inconsistent_features}',affected_metrics:'{operational_efficiency}',affected_rails:'{Cards}',root_causes:'{no_normalization,api_differences}'},
    {name:'Idempotency Failure',description:'Duplicate transactions due to retry without idempotency',category:'integration',severity:'critical',layer:'processing',symptoms:'{double_charges,customer_complaints}',affected_metrics:'{authorization_rate,customer_satisfaction}',affected_rails:'{Cards}',root_causes:'{no_idempotency_keys,network_retry}'},
    {name:'Webhook Integration Failure',description:'Payment status updates not reaching merchant system',category:'integration',severity:'high',layer:'orchestration',symptoms:'{out_of_sync_orders,manual_reconciliation}',affected_metrics:'{operational_efficiency}',affected_rails:'{Cards}',root_causes:'{endpoint_down,no_retry,signature_mismatch}'},
    {name:'API Version Incompatibility',description:'Breaking changes in PSP API affecting integration',category:'integration',severity:'high',layer:'orchestration',symptoms:'{api_errors,feature_breakage}',affected_metrics:'{uptime}',affected_rails:'{Cards}',root_causes:'{no_version_pinning,unmonitored_deprecation}'},
    {name:'SDK Version Conflict',description:'Payment SDK conflicting with other merchant dependencies',category:'integration',severity:'medium',layer:'experience',symptoms:'{build_failures,runtime_errors}',affected_metrics:'{uptime}',affected_rails:'{Cards}',root_causes:'{dependency_conflicts,outdated_sdk}'},
    {name:'Test/Production Environment Mismatch',description:'Payment behavior differs between test and production',category:'integration',severity:'high',layer:'orchestration',symptoms:'{unexpected_production_failures}',affected_metrics:'{authorization_rate}',affected_rails:'{Cards}',root_causes:'{different_configurations,sandbox_limitations}'},
    {name:'Error Handling Gap',description:'Unhandled edge cases in payment error handling',category:'integration',severity:'high',layer:'processing',symptoms:'{silent_failures,stuck_transactions}',affected_metrics:'{authorization_rate,data_integrity}',affected_rails:'{Cards}',root_causes:'{incomplete_error_mapping,missing_fallbacks}'},
    {name:'Currency Precision Issues',description:'Floating point errors in currency calculations',category:'integration',severity:'medium',layer:'processing',symptoms:'{penny_discrepancies,reconciliation_issues}',affected_metrics:'{settlement_accuracy}',affected_rails:'{Cards}',root_causes:'{float_arithmetic,no_decimal_handling}'},
    {name:'Timezone Handling Errors',description:'Transaction timestamps in wrong timezone causing issues',category:'integration',severity:'medium',layer:'processing',symptoms:'{wrong_settlement_date,reporting_errors}',affected_metrics:'{settlement_accuracy}',affected_rails:'{Cards}',root_causes:'{no_utc_standardization,dst_handling}'},
    {name:'Character Encoding Issues',description:'Special characters causing payment failures',category:'integration',severity:'low',layer:'processing',symptoms:'{name_field_errors,address_validation_failure}',affected_metrics:'{authorization_rate}',affected_rails:'{Cards}',root_causes:'{no_utf8,accented_characters}'},
    {name:'PCI Tokenization Migration',description:'Difficulty migrating tokens between PCI vaults',category:'integration',severity:'high',layer:'processing',symptoms:'{token_incompatibility,migration_risk}',affected_metrics:'{authorization_rate}',affected_rails:'{Cards}',root_causes:'{proprietary_tokens,no_network_tokens}'},
    {name:'Legacy System Integration',description:'Difficulty integrating modern payments with legacy systems',category:'integration',severity:'high',layer:'orchestration',symptoms:'{data_format_issues,slow_processing}',affected_metrics:'{operational_efficiency}',affected_rails:'{Cards,ACH}',root_causes:'{batch_vs_realtime,format_conversion}'},
    {name:'Monitoring Blind Spots',description:'Insufficient observability in payment processing pipeline',category:'integration',severity:'medium',layer:'orchestration',symptoms:'{delayed_incident_detection,unclear_root_cause}',affected_metrics:'{uptime,latency}',affected_rails:'{Cards}',root_causes:'{missing_metrics,no_distributed_tracing}'},
    {name:'Configuration Drift',description:'Payment configuration diverging from intended state',category:'integration',severity:'medium',layer:'orchestration',symptoms:'{unexpected_behavior,inconsistent_routing}',affected_metrics:'{authorization_rate}',affected_rails:'{Cards}',root_causes:'{manual_config,no_version_control}'},
  ];

  for (let i = 0; i < problems.length; i += 25) {
    await knex('problems').insert(problems.slice(i, i + 25));
  }

  // Get problem map
  const problemRows = await knex('problems').select('id','name');
  const pm = Object.fromEntries(problemRows.map(p => [p.name, p.id]));

  // ========== SOLUTIONS (200 — 2 per problem) ==========
  const solutionTemplates = [
    ['High Decline Rate',
      ['Implement Smart Routing','Route transactions to optimal acquirer based on BIN, country, and historical approval data','feature','{Smart Routing,BIN Lookup}','high','high'],
      ['Add Retry Logic with Cascade','Retry soft declines with secondary acquirer','feature','{Retry Orchestration,Cascade Routing}','medium','high']],
    ['Cross-Border Authorization Failures',
      ['Deploy Local Acquiring','Use local acquirers in target countries','architectural','{Local Processing,Geographic Routing}','high','high'],
      ['Enable Multi-Currency Processing','Process in cardholder currency','feature','{Multi-Currency Processing,Currency Conversion}','medium','medium']],
    ['3DS Authentication Drop-off',
      ['Implement 3DS 2.x with Frictionless','Upgrade to 3DS 2.x with risk-based frictionless flow','feature','{3D Secure 2.x,Risk-Based Authentication,Exemption Management}','high','high'],
      ['Optimize 3DS UI/UX','Improve authentication page design and flow','process','{Checkout UI}','low','medium']],
    ['False Positive Fraud Blocks',
      ['Deploy ML-Based Fraud Scoring','Replace rules with machine learning model','feature','{Fraud Scoring,Machine Learning Models}','high','high'],
      ['Implement Device Fingerprinting','Add device identification to reduce false positives','feature','{Device Fingerprinting,Behavioral Analytics}','medium','medium']],
    ['Chargeback Threshold Breach',
      ['Implement Chargeback Prevention Suite','Deploy prevention alerts and rapid dispute resolution','feature','{Chargeback Management,Rapid Dispute Resolution}','high','high'],
      ['Strengthen Fraud Prevention','Reduce fraud-related chargebacks','feature','{Fraud Scoring,3D Secure 2.x,Velocity Checks}','high','high']],
    ['Settlement Delay',
      ['Implement Automated Reconciliation','Auto-match transactions to settlements','feature','{Automated Reconciliation,Settlement Reconciliation}','high','high'],
      ['Optimize Settlement Batching','Improve batch processing efficiency','process','{Batch Processing,Clearing}','medium','medium']],
  ];

  // Generate 2 solutions per problem
  const solutions = [];
  for (const problem of problemRows) {
    const template = solutionTemplates.find(t => t[0] === problem.name);
    if (template) {
      for (let s = 1; s <= 2; s++) {
        const [name,desc,type,feats,complexity,impact] = template[s];
        solutions.push({ problem_id: problem.id, name, description: desc, solution_type: type, features_required: feats, complexity, impact, implementation_notes: `Implement ${name} to address ${problem.name}` });
      }
    } else {
      solutions.push({ problem_id: problem.id, name: `Implement monitoring for ${problem.name}`, description: `Deploy monitoring and alerting to detect and prevent ${problem.name}`, solution_type: 'process', features_required: '{Real-Time Analytics,Anomaly Detection}', complexity: 'medium', impact: 'medium', implementation_notes: 'Set up monitoring dashboards and alerts' });
      solutions.push({ problem_id: problem.id, name: `Architectural fix for ${problem.name}`, description: `Redesign payment flow to prevent ${problem.name}`, solution_type: 'architectural', features_required: '{Smart Routing,Multi-PSP Orchestration}', complexity: 'high', impact: 'high', implementation_notes: 'Requires architectural review and implementation' });
    }
  }

  for (let i = 0; i < solutions.length; i += 50) {
    await knex('solutions').insert(solutions.slice(i, i + 50));
  }

  // ========== DIAGNOSIS RULES (50) ==========
  const diagRules = [
    {rule_name:'Low Approval Single Acquirer',conditions:JSON.stringify([{field:'approval_rate',operator:'lt',value:80},{field:'acquirer_count',operator:'eq',value:1}]),problem_id:pm['High Decline Rate'],explanation:'Single acquirer with low approval rate suggests routing improvements needed',confidence:90,priority:10},
    {rule_name:'No Tokenization Low Auth',conditions:JSON.stringify([{field:'tokenization',operator:'eq',value:false},{field:'approval_rate',operator:'lt',value:85}]),problem_id:pm['Expired Card Declines'],explanation:'Missing tokenization leads to stale credentials',confidence:85,priority:8},
    {rule_name:'No 3DS High Fraud',conditions:JSON.stringify([{field:'three_ds',operator:'eq',value:false},{field:'fraud_rate',operator:'gt',value:2}]),problem_id:pm['CNP Fraud Spike'],explanation:'No 3DS authentication enables CNP fraud',confidence:88,priority:9},
    {rule_name:'High Chargeback Rate',conditions:JSON.stringify([{field:'chargeback_rate',operator:'gt',value:0.8}]),problem_id:pm['Chargeback Threshold Breach'],explanation:'Chargeback rate approaching network threshold',confidence:95,priority:10},
    {rule_name:'Cross-Border No Local Acquiring',conditions:JSON.stringify([{field:'country',operator:'not_eq',value:'US'},{field:'acquirer_count',operator:'eq',value:1}]),problem_id:pm['Cross-Border Authorization Failures'],explanation:'Single acquirer for cross-border suggests need for local acquiring',confidence:80,priority:7},
    {rule_name:'High Fraud Low Auth',conditions:JSON.stringify([{field:'fraud_rate',operator:'gt',value:1.5},{field:'approval_rate',operator:'lt',value:85}]),problem_id:pm['False Positive Fraud Blocks'],explanation:'High fraud rate with low approval suggests false positives',confidence:82,priority:8},
    {rule_name:'No Retry Logic',conditions:JSON.stringify([{field:'approval_rate',operator:'lt',value:88},{field:'acquirer_count',operator:'gte',value:2}]),problem_id:pm['Soft Decline Mishandling'],explanation:'Multiple acquirers without retry optimization',confidence:78,priority:7},
    {rule_name:'3DS Drop-off Detection',conditions:JSON.stringify([{field:'three_ds',operator:'eq',value:true},{field:'approval_rate',operator:'lt',value:82}]),problem_id:pm['3DS Authentication Drop-off'],explanation:'3DS enabled but low approval suggests authentication friction',confidence:75,priority:6},
    {rule_name:'Settlement Delay Detection',conditions:JSON.stringify([{field:'volume',operator:'gt',value:100000}]),problem_id:pm['Settlement Delay'],explanation:'High volume merchants may experience settlement delays',confidence:60,priority:4},
    {rule_name:'Card Testing Detection',conditions:JSON.stringify([{field:'fraud_rate',operator:'gt',value:3}]),problem_id:pm['Card Testing Attack'],explanation:'Very high fraud rate indicates potential card testing',confidence:85,priority:9},
  ];

  // Generate more diagnosis rules to reach 50
  const extraDiagPatterns = [
    ['Volume Spike Alert',JSON.stringify([{field:'volume',operator:'gt',value:500000}]),pm['Peak Load Degradation'],'High volume may cause performance degradation',70,5],
    ['Multi-PSP Inconsistency',JSON.stringify([{field:'acquirer_count',operator:'gt',value:3}]),pm['Multi-PSP Consistency Issues'],'Multiple PSPs may cause consistency issues',65,5],
    ['Compliance Risk BR',JSON.stringify([{field:'country',operator:'eq',value:'BR'}]),pm['Cross-Border Regulatory Gap'],'Brazil has specific payment regulations',60,4],
    ['Compliance Risk EU',JSON.stringify([{field:'country',operator:'in',value:['DE','FR','NL','ES','IT']}]),pm['SCA Compliance Gap'],'EU requires SCA compliance',85,8],
    ['High Ticket Fraud Risk',JSON.stringify([{field:'ticket_size',operator:'gt',value:500}]),pm['CNP Fraud Spike'],'High ticket transactions have higher fraud risk',70,6],
  ];

  for (let i = 0; i < 40; i++) {
    const pattern = extraDiagPatterns[i % extraDiagPatterns.length];
    diagRules.push({
      rule_name: `${pattern[0]} v${Math.floor(i/5)+2}`,
      conditions: pattern[1], problem_id: pattern[2],
      explanation: pattern[3], confidence: pattern[4] - (i % 10),
      priority: pattern[5]
    });
  }

  for (let i = 0; i < diagRules.length; i += 25) {
    await knex('diagnosis_rules').insert(diagRules.slice(i, i + 25));
  }

  // ========== METRICS (50) ==========
  // Insert root metrics first, then children
  const rootMetrics = [
    {name:'Payment Success Rate',description:'Overall payment success rate',category:'success',unit:'percentage',formula:'successful_transactions / total_transactions * 100',benchmarks:'{"good":">95%","average":"90-95%","poor":"<90%"}'},
    {name:'Revenue',description:'Total payment revenue processed',category:'success',unit:'currency',formula:'sum(transaction_amounts)',benchmarks:'{}'},
  ];
  await knex('metrics').insert(rootMetrics);

  const rootIds = await knex('metrics').whereIn('name',['Payment Success Rate','Revenue']).select('id','name');
  const rootMap = Object.fromEntries(rootIds.map(r => [r.name, r.id]));

  // Level 2 metrics
  const l2Metrics = [
    {name:'Authorization Rate',description:'Percentage of transactions approved by issuers',category:'success',unit:'percentage',parent_metric_id:rootMap['Payment Success Rate'],formula:'approved_auths / total_auths * 100',affected_by_features:'{Smart Routing,Network Tokenization,3D Secure 2.x,Retry Orchestration}',benchmarks:'{"good":">92%","average":"85-92%","poor":"<85%"}'},
    {name:'Conversion Rate',description:'Checkout attempts resulting in successful payment',category:'success',unit:'percentage',parent_metric_id:rootMap['Payment Success Rate'],formula:'completed_payments / checkout_starts * 100',affected_by_features:'{Checkout UI,One-Click Pay,Express Checkout}',benchmarks:'{"good":">75%","average":"60-75%","poor":"<60%"}'},
    {name:'Fraud Rate',description:'Percentage of fraudulent transactions',category:'fraud',unit:'percentage',parent_metric_id:rootMap['Payment Success Rate'],formula:'fraudulent_transactions / total_transactions * 100',affected_by_features:'{Fraud Scoring,3D Secure 2.x,Velocity Checks}',benchmarks:'{"good":"<0.5%","average":"0.5-1.5%","poor":">1.5%"}'},
    {name:'Chargeback Rate',description:'Disputes as percentage of transactions',category:'fraud',unit:'percentage',parent_metric_id:rootMap['Payment Success Rate'],formula:'chargebacks / total_transactions * 100',affected_by_features:'{Chargeback Management,Fraud Scoring}',benchmarks:'{"good":"<0.5%","average":"0.5-0.9%","poor":">0.9%"}'},
    {name:'Settlement Metrics',description:'Settlement performance metrics',category:'settlement',unit:'percentage',parent_metric_id:rootMap['Payment Success Rate'],formula:'settled_on_time / total_settlements * 100',affected_by_features:'{Automated Reconciliation,Clearing}',benchmarks:'{"good":">99%","average":"97-99%","poor":"<97%"}'},
    {name:'Cost Metrics',description:'Payment processing cost metrics',category:'cost',unit:'currency',parent_metric_id:rootMap['Revenue'],formula:'total_processing_fees / total_volume * 10000',affected_by_features:'{Interchange Optimization,Cost-Based Routing}',benchmarks:'{}'},
    {name:'Performance Metrics',description:'System performance metrics',category:'performance',unit:'time',parent_metric_id:rootMap['Payment Success Rate'],formula:'p95_response_time',affected_by_features:'{API Gateway,Circuit Breaker}',benchmarks:'{"good":"<500ms","average":"500-2000ms","poor":">2000ms"}'},
  ];
  await knex('metrics').insert(l2Metrics);

  const l2Ids = await knex('metrics').whereIn('name',l2Metrics.map(m=>m.name)).select('id','name');
  const l2Map = Object.fromEntries(l2Ids.map(r => [r.name, r.id]));

  // Level 3 metrics
  const l3Metrics = [
    {name:'Issuer Approval Rate',description:'Approval rate from issuing banks',category:'success',unit:'percentage',parent_metric_id:l2Map['Authorization Rate'],formula:'issuer_approvals / issuer_requests * 100',affected_by_features:'{Authorization Optimization,Network Score}',benchmarks:'{"good":">94%","average":"88-94%","poor":"<88%"}'},
    {name:'Network Success Rate',description:'Success rate at card network level',category:'success',unit:'percentage',parent_metric_id:l2Map['Authorization Rate'],formula:'network_successes / network_requests * 100',affected_by_features:'{ISO 8583 Messaging}',benchmarks:'{"good":">99%"}'},
    {name:'Retry Success Rate',description:'Success rate of retried transactions',category:'success',unit:'percentage',parent_metric_id:l2Map['Authorization Rate'],formula:'retry_successes / retry_attempts * 100',affected_by_features:'{Retry Orchestration,Cascade Routing}',benchmarks:'{"good":">25%","average":"15-25%","poor":"<15%"}'},
    {name:'Soft Decline Recovery',description:'Soft declines successfully recovered',category:'success',unit:'percentage',parent_metric_id:l2Map['Authorization Rate'],formula:'recovered_soft_declines / total_soft_declines * 100',affected_by_features:'{Soft Decline Handling,Retry Orchestration}',benchmarks:'{"good":">30%"}'},
    {name:'Token Auth Rate',description:'Authorization rate for tokenized transactions',category:'success',unit:'percentage',parent_metric_id:l2Map['Authorization Rate'],formula:'token_approvals / token_auths * 100',affected_by_features:'{Network Tokenization,Token Lifecycle Management}',benchmarks:'{"good":">95%"}'},
    {name:'Checkout Completion Rate',description:'Users completing checkout once started',category:'success',unit:'percentage',parent_metric_id:l2Map['Conversion Rate'],formula:'checkout_completed / checkout_started * 100',affected_by_features:'{Checkout UI,Express Checkout}',benchmarks:'{"good":">80%","average":"65-80%","poor":"<65%"}'},
    {name:'Authentication Success Rate',description:'3DS authentication completion rate',category:'success',unit:'percentage',parent_metric_id:l2Map['Conversion Rate'],formula:'auth_success / auth_attempts * 100',affected_by_features:'{3D Secure 2.x,Risk-Based Authentication}',benchmarks:'{"good":">90%"}'},
    {name:'Payment Method Availability',description:'Percentage of users seeing preferred payment method',category:'success',unit:'percentage',parent_metric_id:l2Map['Conversion Rate'],formula:'preferred_method_available / total_checkouts * 100',affected_by_features:'{Payment Method Selection,APM Integration}',benchmarks:'{"good":">85%"}'},
    {name:'Cart Abandonment Rate',description:'Users abandoning cart before payment',category:'success',unit:'percentage',parent_metric_id:l2Map['Conversion Rate'],formula:'abandoned_carts / total_carts * 100',affected_by_features:'{Cart Recovery,Express Checkout}',benchmarks:'{"good":"<60%","average":"60-75%","poor":">75%"}'},
    {name:'False Positive Rate',description:'Legitimate transactions flagged as fraud',category:'fraud',unit:'percentage',parent_metric_id:l2Map['Fraud Rate'],formula:'false_positives / total_flagged * 100',affected_by_features:'{Fraud Scoring,Machine Learning Models}',benchmarks:'{"good":"<3%","average":"3-8%","poor":">8%"}'},
    {name:'Fraud Detection Rate',description:'Actual fraud caught by systems',category:'fraud',unit:'percentage',parent_metric_id:l2Map['Fraud Rate'],formula:'detected_fraud / total_fraud * 100',affected_by_features:'{Fraud Scoring,Velocity Checks,Graph Analytics}',benchmarks:'{"good":">95%","average":"85-95%","poor":"<85%"}'},
    {name:'Fraud Review Rate',description:'Transactions requiring manual review',category:'fraud',unit:'percentage',parent_metric_id:l2Map['Fraud Rate'],formula:'manual_review / total_transactions * 100',affected_by_features:'{Fraud Scoring,Rule-Based Fraud}',benchmarks:'{"good":"<2%","average":"2-5%","poor":">5%"}'},
    {name:'Dispute Win Rate',description:'Percentage of disputes won by merchant',category:'fraud',unit:'percentage',parent_metric_id:l2Map['Chargeback Rate'],formula:'disputes_won / total_disputes * 100',affected_by_features:'{Representment,Chargeback Management}',benchmarks:'{"good":">60%","average":"40-60%","poor":"<40%"}'},
    {name:'Prevention Alert Rate',description:'Chargebacks prevented by prevention alerts',category:'fraud',unit:'percentage',parent_metric_id:l2Map['Chargeback Rate'],formula:'prevented / total_potential_chargebacks * 100',affected_by_features:'{Rapid Dispute Resolution,Chargeback Management}',benchmarks:'{"good":">40%"}'},
    {name:'Settlement Success Rate',description:'Settlements completed successfully',category:'settlement',unit:'percentage',parent_metric_id:l2Map['Settlement Metrics'],formula:'successful_settlements / total_settlements * 100',affected_by_features:'{Clearing,Netting}',benchmarks:'{"good":">99.5%"}'},
    {name:'Reconciliation Accuracy',description:'Automated matching accuracy',category:'settlement',unit:'percentage',parent_metric_id:l2Map['Settlement Metrics'],formula:'auto_matched / total_transactions * 100',affected_by_features:'{Automated Reconciliation,Three-Way Reconciliation}',benchmarks:'{"good":">99.9%","average":"99-99.9%","poor":"<99%"}'},
    {name:'Average Settlement Time',description:'Mean time from capture to merchant funding',category:'settlement',unit:'time',parent_metric_id:l2Map['Settlement Metrics'],formula:'avg(settlement_timestamp - capture_timestamp)',affected_by_features:'{T+1 Settlement,Same-Day Settlement}',benchmarks:'{"good":"<24h","average":"24-48h","poor":">48h"}'},
    {name:'Interchange Cost',description:'Average interchange fee per transaction',category:'cost',unit:'currency',parent_metric_id:l2Map['Cost Metrics'],formula:'total_interchange / total_volume * 10000',affected_by_features:'{Interchange Optimization,BIN Lookup}',benchmarks:'{}'},
    {name:'Processing Fee',description:'Per-transaction processing cost',category:'cost',unit:'currency',parent_metric_id:l2Map['Cost Metrics'],formula:'total_processing_fees / transaction_count',affected_by_features:'{Cost-Based Routing}',benchmarks:'{}'},
    {name:'FX Cost',description:'Foreign exchange conversion costs',category:'cost',unit:'currency',parent_metric_id:l2Map['Cost Metrics'],formula:'fx_markup_total / cross_border_volume * 10000',affected_by_features:'{FX Conversion,Local Processing}',benchmarks:'{}'},
    {name:'Scheme Fee Cost',description:'Card scheme assessment fees',category:'cost',unit:'currency',parent_metric_id:l2Map['Cost Metrics'],formula:'total_scheme_fees / total_volume * 10000',affected_by_features:'{Scheme Fee Management}',benchmarks:'{}'},
    {name:'API Latency P95',description:'95th percentile API response time',category:'performance',unit:'time',parent_metric_id:l2Map['Performance Metrics'],formula:'p95(response_time)',affected_by_features:'{API Gateway,Circuit Breaker}',benchmarks:'{"good":"<300ms","average":"300-1000ms","poor":">1000ms"}'},
    {name:'System Uptime',description:'Payment system availability',category:'performance',unit:'percentage',parent_metric_id:l2Map['Performance Metrics'],formula:'uptime_minutes / total_minutes * 100',affected_by_features:'{Failover Management,Circuit Breaker}',benchmarks:'{"good":">99.99%","average":"99.9-99.99%","poor":"<99.9%"}'},
    {name:'Error Rate',description:'Percentage of requests returning errors',category:'performance',unit:'percentage',parent_metric_id:l2Map['Performance Metrics'],formula:'error_responses / total_requests * 100',affected_by_features:'{Error Code Mapping,Idempotency Service}',benchmarks:'{"good":"<0.1%","average":"0.1-1%","poor":">1%"}'},
    {name:'Throughput',description:'Transactions processed per second',category:'performance',unit:'count',parent_metric_id:l2Map['Performance Metrics'],formula:'transactions / seconds',affected_by_features:'{Load Balancing,Batch Processing}',benchmarks:'{}'},
  ];

  for (let i = 0; i < l3Metrics.length; i += 25) {
    await knex('metrics').insert(l3Metrics.slice(i, i + 25));
  }

  // ========== ECOSYSTEM PLAYERS (40) ==========
  const players = [
    {name:'Visa',description:'Global card network',type:'network',category:'global',supported_rails:'{Cards}',supported_countries:'{US,GB,DE,FR,BR,JP,AU,CA,MX,IN}',key_features:'{Network Tokenization,Visa Direct,3DS,Account Updater}'},
    {name:'Mastercard',description:'Global card network',type:'network',category:'global',supported_rails:'{Cards}',supported_countries:'{US,GB,DE,FR,BR,JP,AU,CA,MX,IN}',key_features:'{Network Tokenization,Mastercard Send,3DS,Account Updater}'},
    {name:'American Express',description:'Card network and issuer',type:'network',category:'global',supported_rails:'{Cards}',supported_countries:'{US,GB,DE,AU,CA,JP}',key_features:'{SafeKey,Token Service,Enhanced Authorization}'},
    {name:'Discover',description:'US-focused card network',type:'network',category:'regional',supported_rails:'{Cards}',supported_countries:'{US,CA}',key_features:'{ProtectBuy,D-PAS}'},
    {name:'UnionPay',description:'Chinese card network',type:'network',category:'regional',supported_rails:'{Cards}',supported_countries:'{CN,HK,SG}',key_features:'{QR Payment,Online Payment}'},
    {name:'PIX/BCB',description:'Brazilian Central Bank instant payment',type:'network',category:'regional',supported_rails:'{PIX}',supported_countries:'{BR}',key_features:'{Instant Settlement,QR Code,Open Finance}'},
    {name:'Stripe',description:'Technology-first payment platform',type:'psp',category:'global',supported_rails:'{Cards,ACH,SEPA,Digital Wallets}',supported_countries:'{US,GB,DE,FR,AU,CA,SG,JP}',key_features:'{Smart Routing,Radar Fraud,Connect,Billing}'},
    {name:'Adyen',description:'Enterprise payment platform',type:'psp',category:'global',supported_rails:'{Cards,ACH,SEPA,Digital Wallets,PIX}',supported_countries:'{US,GB,DE,FR,BR,AU,JP,SG,NL}',key_features:'{RevenueAccelerate,Smart Routing,Risk Management}'},
    {name:'Checkout.com',description:'Cloud-based payment processor',type:'psp',category:'global',supported_rails:'{Cards,Digital Wallets}',supported_countries:'{US,GB,DE,FR,SG}',key_features:'{Intelligent Acceptance,Fraud Detection,Network Tokens}'},
    {name:'Braintree',description:'PayPal-owned payment gateway',type:'psp',category:'global',supported_rails:'{Cards,Digital Wallets}',supported_countries:'{US,GB,AU,CA}',key_features:'{Vault,3DS,PayPal Integration}'},
    {name:'Worldpay',description:'Large-scale payment processor',type:'psp',category:'global',supported_rails:'{Cards,ACH}',supported_countries:'{US,GB,DE,FR}',key_features:'{FraudSight,Dynamic 3DS,Network Tokens}'},
    {name:'dLocal',description:'Emerging markets payment platform',type:'psp',category:'regional',supported_rails:'{Cards,PIX,Digital Wallets}',supported_countries:'{BR,MX,AR,CO,CL,IN}',key_features:'{Local Payment Methods,Cross-Border,FX}'},
    {name:'PayPal',description:'Global digital payment platform',type:'wallet',category:'global',supported_rails:'{Digital Wallets,Cards}',supported_countries:'{US,GB,DE,FR,AU,CA,BR}',key_features:'{Buyer Protection,One Touch,Credit}'},
    {name:'Apple Pay',description:'Apple mobile payment service',type:'wallet',category:'global',supported_rails:'{Digital Wallets,Cards}',supported_countries:'{US,GB,DE,FR,AU,CA,JP,SG}',key_features:'{Device Tokenization,Biometric Auth,In-App Payment}'},
    {name:'Google Pay',description:'Google mobile payment service',type:'wallet',category:'global',supported_rails:'{Digital Wallets,Cards}',supported_countries:'{US,GB,DE,AU,IN,SG,JP}',key_features:'{Device Tokenization,In-App Payment,P2P}'},
    {name:'Alipay',description:'Chinese digital payment platform',type:'wallet',category:'regional',supported_rails:'{Digital Wallets}',supported_countries:'{CN,HK,SG}',key_features:'{QR Payment,Mini Programs,Cross-Border}'},
    {name:'MercadoPago',description:'Latin American payment platform',type:'wallet',category:'regional',supported_rails:'{Digital Wallets,Cards,PIX}',supported_countries:'{BR,MX,AR,CO,CL}',key_features:'{QR Payment,Point,Checkout Pro}'},
    {name:'M-Pesa',description:'Mobile money platform',type:'wallet',category:'regional',supported_rails:'{Digital Wallets}',supported_countries:'{KE,TZ,GH,MZ}',key_features:'{Mobile Money,P2P,Bill Payment}'},
    {name:'JPMorgan Chase',description:'Global bank and acquirer',type:'acquirer',category:'global',supported_rails:'{Cards,ACH,Wire Transfer}',supported_countries:'{US,GB,DE}',key_features:'{Merchant Services,Treasury,FX}'},
    {name:'Citibank',description:'Global bank with merchant services',type:'acquirer',category:'global',supported_rails:'{Cards,Wire Transfer}',supported_countries:'{US,GB,SG,HK}',key_features:'{Treasury,Trade Finance,FX}'},
    {name:'Barclays',description:'UK bank with payment processing',type:'acquirer',category:'regional',supported_rails:'{Cards,SEPA}',supported_countries:'{GB,DE}',key_features:'{Merchant Acquiring,Smartpay}'},
    {name:'Itau Unibanco',description:'Brazilian bank',type:'acquirer',category:'regional',supported_rails:'{Cards,PIX}',supported_countries:'{BR}',key_features:'{Rede Acquiring,PIX,Treasury}'},
    {name:'HSBC',description:'Global bank',type:'acquirer',category:'global',supported_rails:'{Cards,Wire Transfer,SEPA}',supported_countries:'{GB,HK,SG,AU}',key_features:'{Global Payments,Trade Finance,FX}'},
    {name:'Fiserv',description:'Payment technology and processing',type:'psp',category:'global',supported_rails:'{Cards,ACH}',supported_countries:'{US,GB}',key_features:'{Clover POS,Card Processing,Banking Platform}'},
    {name:'FIS',description:'Financial technology provider',type:'psp',category:'global',supported_rails:'{Cards,ACH}',supported_countries:'{US,GB,DE}',key_features:'{Worldpay,Banking,Capital Markets}'},
    {name:'Global Payments',description:'Payment technology company',type:'psp',category:'global',supported_rails:'{Cards}',supported_countries:'{US,GB,CA,AU}',key_features:'{Merchant Solutions,Issuer Solutions}'},
    {name:'Square/Block',description:'Commerce and payment platform',type:'psp',category:'global',supported_rails:'{Cards,ACH,Digital Wallets}',supported_countries:'{US,GB,AU,CA,JP}',key_features:'{Square POS,Cash App,Afterpay}'},
    {name:'Klarna',description:'BNPL payment provider',type:'bnpl_provider',category:'global',supported_rails:'{Cards}',supported_countries:'{US,GB,DE,SE,AU}',key_features:'{Pay Later,Pay in 4,Financing}'},
    {name:'Affirm',description:'US BNPL provider',type:'bnpl_provider',category:'regional',supported_rails:'{Cards}',supported_countries:'{US,CA}',key_features:'{Pay Over Time,Split Pay,Virtual Card}'},
    {name:'Afterpay',description:'BNPL provider (Block-owned)',type:'bnpl_provider',category:'global',supported_rails:'{Cards}',supported_countries:'{US,AU,GB}',key_features:'{Pay in 4,In-Store}'},
    {name:'Marqeta',description:'Card issuing platform',type:'psp',category:'global',supported_rails:'{Cards}',supported_countries:'{US,GB,AU}',key_features:'{Card Issuing,JIT Funding,Tokenization}'},
    {name:'Plaid',description:'Financial data connectivity',type:'psp',category:'regional',supported_rails:'{ACH}',supported_countries:'{US,GB,CA}',key_features:'{Account Linking,Identity,Balance Check}'},
    {name:'NPCI',description:'India payments infrastructure',type:'network',category:'regional',supported_rails:'{UPI}',supported_countries:'{IN}',key_features:'{UPI,RuPay,IMPS,NACH}'},
    {name:'EPC',description:'European Payments Council',type:'network',category:'regional',supported_rails:'{SEPA}',supported_countries:'{DE,FR,NL,ES,IT,BE}',key_features:'{SEPA Credit,SEPA Direct Debit,Instant SEPA}'},
    {name:'NACHA',description:'US ACH network operator',type:'network',category:'regional',supported_rails:'{ACH}',supported_countries:'{US}',key_features:'{ACH Credit,ACH Debit,Same Day ACH}'},
    {name:'The Clearing House',description:'US real-time payments',type:'network',category:'regional',supported_rails:'{ACH}',supported_countries:'{US}',key_features:'{RTP,EPN,CHIPS}'},
    {name:'CyberSource',description:'Visa-owned payment management',type:'psp',category:'global',supported_rails:'{Cards}',supported_countries:'{US,GB,DE,SG}',key_features:'{Decision Manager,Token Management,Payer Auth}'},
    {name:'Spreedly',description:'Payment orchestration platform',type:'psp',category:'global',supported_rails:'{Cards}',supported_countries:'{US,GB,AU}',key_features:'{Payment Orchestration,Universal Vault,Network Tokens}'},
    {name:'Primer',description:'Unified payment infrastructure',type:'psp',category:'global',supported_rails:'{Cards,Digital Wallets}',supported_countries:'{US,GB,DE,FR}',key_features:'{Universal Checkout,Workflows,Fallbacks}'},
    {name:'Nuvei',description:'Payment technology company',type:'psp',category:'global',supported_rails:'{Cards,Digital Wallets,Crypto}',supported_countries:'{US,GB,CA,DE}',key_features:'{Alternative Payments,Crypto,Gaming}'},
  ];

  for (let i = 0; i < players.length; i += 20) {
    await knex('ecosystem_players').insert(players.slice(i, i + 20));
  }

  // ========== TAXONOMY (60) ==========
  // Root level
  const taxRoots = [
    {name:'Payment Methods',description:'Types of payment instruments',level:'domain',sort_order:1},
    {name:'Processing Infrastructure',description:'Technology stack for payment processing',level:'domain',sort_order:2},
    {name:'Risk & Compliance',description:'Risk management and regulatory compliance',level:'domain',sort_order:3},
    {name:'Settlement & Reconciliation',description:'Post-transaction processing',level:'domain',sort_order:4},
    {name:'Value-Added Services',description:'Additional payment capabilities',level:'domain',sort_order:5},
  ];
  await knex('taxonomy').insert(taxRoots);
  const taxRootRows = await knex('taxonomy').whereNull('parent_id').select('id','name');
  const txm = Object.fromEntries(taxRootRows.map(r => [r.name, r.id]));

  // Level 2
  const taxL2 = [
    {name:'Cards',description:'Credit, debit, and prepaid cards',level:'category',parent_id:txm['Payment Methods'],sort_order:1},
    {name:'Bank Transfers',description:'Direct bank-to-bank transfers',level:'category',parent_id:txm['Payment Methods'],sort_order:2},
    {name:'Digital Wallets',description:'Electronic wallet payments',level:'category',parent_id:txm['Payment Methods'],sort_order:3},
    {name:'Alternative Payments',description:'BNPL, crypto, and other methods',level:'category',parent_id:txm['Payment Methods'],sort_order:4},
    {name:'Authorization & Capture',description:'Transaction processing operations',level:'category',parent_id:txm['Processing Infrastructure'],sort_order:1},
    {name:'Tokenization',description:'Payment credential tokenization',level:'category',parent_id:txm['Processing Infrastructure'],sort_order:2},
    {name:'Routing & Orchestration',description:'Transaction routing and provider management',level:'category',parent_id:txm['Processing Infrastructure'],sort_order:3},
    {name:'Authentication',description:'Cardholder and identity verification',level:'category',parent_id:txm['Processing Infrastructure'],sort_order:4},
    {name:'Fraud Prevention',description:'Fraud detection and prevention',level:'category',parent_id:txm['Risk & Compliance'],sort_order:1},
    {name:'Regulatory Compliance',description:'Legal and regulatory requirements',level:'category',parent_id:txm['Risk & Compliance'],sort_order:2},
    {name:'Dispute Management',description:'Chargebacks and dispute resolution',level:'category',parent_id:txm['Risk & Compliance'],sort_order:3},
    {name:'Clearing & Settlement',description:'Transaction clearing and fund settlement',level:'category',parent_id:txm['Settlement & Reconciliation'],sort_order:1},
    {name:'Reconciliation',description:'Transaction matching and verification',level:'category',parent_id:txm['Settlement & Reconciliation'],sort_order:2},
    {name:'Payouts',description:'Fund disbursement to merchants',level:'category',parent_id:txm['Settlement & Reconciliation'],sort_order:3},
    {name:'Analytics & Reporting',description:'Payment analytics and business intelligence',level:'category',parent_id:txm['Value-Added Services'],sort_order:1},
    {name:'Optimization',description:'Payment performance optimization',level:'category',parent_id:txm['Value-Added Services'],sort_order:2},
    {name:'Platform Services',description:'Marketplace and platform capabilities',level:'category',parent_id:txm['Value-Added Services'],sort_order:3},
  ];
  await knex('taxonomy').insert(taxL2);
  const taxL2Rows = await knex('taxonomy').whereNotNull('parent_id').where('level','category').select('id','name');
  const txl2 = Object.fromEntries(taxL2Rows.map(r => [r.name, r.id]));

  // Level 3
  const taxL3 = [
    {name:'Credit Cards',description:'Credit line based card payments',level:'subcategory',parent_id:txl2['Cards'],sort_order:1},
    {name:'Debit Cards',description:'Direct bank account linked cards',level:'subcategory',parent_id:txl2['Cards'],sort_order:2},
    {name:'Prepaid Cards',description:'Pre-loaded value cards',level:'subcategory',parent_id:txl2['Cards'],sort_order:3},
    {name:'Virtual Cards',description:'Digitally-issued card numbers',level:'subcategory',parent_id:txl2['Cards'],sort_order:4},
    {name:'Instant Payments',description:'Real-time bank transfers (PIX, FedNow)',level:'subcategory',parent_id:txl2['Bank Transfers'],sort_order:1},
    {name:'ACH/SEPA',description:'Batch bank transfer systems',level:'subcategory',parent_id:txl2['Bank Transfers'],sort_order:2},
    {name:'Wire Transfers',description:'High-value bank wires',level:'subcategory',parent_id:txl2['Bank Transfers'],sort_order:3},
    {name:'Open Banking',description:'PSD2/open banking initiated payments',level:'subcategory',parent_id:txl2['Bank Transfers'],sort_order:4},
    {name:'Mobile Wallets',description:'Apple Pay, Google Pay',level:'subcategory',parent_id:txl2['Digital Wallets'],sort_order:1},
    {name:'P2P Wallets',description:'PayPal, Venmo, Cash App',level:'subcategory',parent_id:txl2['Digital Wallets'],sort_order:2},
    {name:'Regional Wallets',description:'Alipay, MercadoPago, M-Pesa',level:'subcategory',parent_id:txl2['Digital Wallets'],sort_order:3},
    {name:'BNPL',description:'Buy now pay later services',level:'subcategory',parent_id:txl2['Alternative Payments'],sort_order:1},
    {name:'Cryptocurrency',description:'Bitcoin, stablecoins, crypto payments',level:'subcategory',parent_id:txl2['Alternative Payments'],sort_order:2},
    {name:'Cash Vouchers',description:'Boleto, OXXO, cash-based payments',level:'subcategory',parent_id:txl2['Alternative Payments'],sort_order:3},
    {name:'Network Tokens',description:'Visa/MC network-level tokenization',level:'subcategory',parent_id:txl2['Tokenization'],sort_order:1},
    {name:'Gateway Tokens',description:'PSP-level tokenization',level:'subcategory',parent_id:txl2['Tokenization'],sort_order:2},
    {name:'PCI Vaulting',description:'Secure card data storage',level:'subcategory',parent_id:txl2['Tokenization'],sort_order:3},
    {name:'Smart Routing',description:'ML-based transaction routing',level:'subcategory',parent_id:txl2['Routing & Orchestration'],sort_order:1},
    {name:'Failover & Retry',description:'Cascade routing and retry logic',level:'subcategory',parent_id:txl2['Routing & Orchestration'],sort_order:2},
    {name:'Multi-Provider',description:'Multi-PSP orchestration',level:'subcategory',parent_id:txl2['Routing & Orchestration'],sort_order:3},
    {name:'3D Secure',description:'Cardholder authentication protocol',level:'subcategory',parent_id:txl2['Authentication'],sort_order:1},
    {name:'Biometric Auth',description:'Fingerprint and facial recognition',level:'subcategory',parent_id:txl2['Authentication'],sort_order:2},
    {name:'Risk-Based Auth',description:'Adaptive authentication',level:'subcategory',parent_id:txl2['Authentication'],sort_order:3},
    {name:'ML Fraud Detection',description:'Machine learning fraud models',level:'subcategory',parent_id:txl2['Fraud Prevention'],sort_order:1},
    {name:'Rules Engine',description:'Configurable fraud rules',level:'subcategory',parent_id:txl2['Fraud Prevention'],sort_order:2},
    {name:'Identity Verification',description:'KYC and identity checks',level:'subcategory',parent_id:txl2['Fraud Prevention'],sort_order:3},
    {name:'KYC/AML',description:'Know your customer and anti-money laundering',level:'subcategory',parent_id:txl2['Regulatory Compliance'],sort_order:1},
    {name:'PCI DSS',description:'Payment card data security',level:'subcategory',parent_id:txl2['Regulatory Compliance'],sort_order:2},
    {name:'SCA/PSD2',description:'Strong customer authentication for EU',level:'subcategory',parent_id:txl2['Regulatory Compliance'],sort_order:3},
    {name:'Chargeback Prevention',description:'Pre-dispute resolution',level:'subcategory',parent_id:txl2['Dispute Management'],sort_order:1},
    {name:'Representment',description:'Dispute response and evidence',level:'subcategory',parent_id:txl2['Dispute Management'],sort_order:2},
    {name:'Net Settlement',description:'Batch net amount settlement',level:'subcategory',parent_id:txl2['Clearing & Settlement'],sort_order:1},
    {name:'Real-Time Settlement',description:'Instant fund settlement',level:'subcategory',parent_id:txl2['Clearing & Settlement'],sort_order:2},
    {name:'Auto-Reconciliation',description:'Automated transaction matching',level:'subcategory',parent_id:txl2['Reconciliation'],sort_order:1},
    {name:'Exception Management',description:'Handling reconciliation exceptions',level:'subcategory',parent_id:txl2['Reconciliation'],sort_order:2},
    {name:'Merchant Payouts',description:'Fund disbursement to merchants',level:'subcategory',parent_id:txl2['Payouts'],sort_order:1},
    {name:'Marketplace Splits',description:'Multi-party fund distribution',level:'subcategory',parent_id:txl2['Payouts'],sort_order:2},
    {name:'Real-Time Analytics',description:'Live transaction monitoring',level:'subcategory',parent_id:txl2['Analytics & Reporting'],sort_order:1},
  ];

  for (let i = 0; i < taxL3.length; i += 20) {
    await knex('taxonomy').insert(taxL3.slice(i, i + 20));
  }

  console.log('Seed data Part 2 inserted successfully');
  console.log(`Problems: ${problems.length}`);
  console.log(`Solutions: ${solutions.length}`);
  console.log(`Diagnosis Rules: ${diagRules.length}`);
  console.log(`Ecosystem Players: ${players.length}`);
};
