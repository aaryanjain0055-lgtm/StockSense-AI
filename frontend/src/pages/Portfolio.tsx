import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";

import {
  BriefcaseBusiness,
  CircleDollarSign,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  TrendingDown,
  TrendingUp,
  WalletCards,
  X,
} from "lucide-react";

import PageHeader from "../components/common/PageHeader";

import {
  addHolding,
  createPortfolio,
  deleteHolding,
  getPortfolioAnalytics,
  getPortfolios,
  updateHolding,
  type Portfolio as PortfolioType,
  type PortfolioAnalytics,
  type PortfolioHoldingAnalytics,
} from "../services/portfolioService";

import {
  searchStocks,
} from "../services/marketService";


type SearchResult = {
  symbol: string;
  name?: string;
  company_name?: string;
  exchange?: string;
};


function getErrorMessage(
  error: unknown,
): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const responseError =
      error as {
        response?: {
          data?: {
            detail?: string;
          };
        };
      };

    const detail =
      responseError.response
        ?.data?.detail;

    if (
      typeof detail === "string"
    ) {
      return detail;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong.";
}


function formatMoney(
  value: number | null | undefined,
) {
  if (
    value === null ||
    value === undefined
  ) {
    return "N/A";
  }

  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    },
  ).format(value);
}


export default function Portfolio() {
  const [
    portfolios,
    setPortfolios,
  ] = useState<PortfolioType[]>([]);

  const [
    selectedPortfolioId,
    setSelectedPortfolioId,
  ] = useState<number | null>(
    null,
  );

  const [
    analytics,
    setAnalytics,
  ] =
    useState<PortfolioAnalytics | null>(
      null,
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");


  // =========================================================
  // CREATE PORTFOLIO STATE
  // =========================================================

  const [
    portfolioName,
    setPortfolioName,
  ] = useState("");

  const [
    portfolioDescription,
    setPortfolioDescription,
  ] = useState("");

  const [
    submittingPortfolio,
    setSubmittingPortfolio,
  ] = useState(false);


  // =========================================================
  // ADD HOLDING STATE
  // =========================================================

  const [
    stockQuery,
    setStockQuery,
  ] = useState("");

  const [
    selectedSymbol,
    setSelectedSymbol,
  ] = useState("");

  const [
    selectedCompanyName,
    setSelectedCompanyName,
  ] = useState("");

  const [
    searchResults,
    setSearchResults,
  ] = useState<SearchResult[]>([]);

  const [
    searching,
    setSearching,
  ] = useState(false);

  const [
    showSuggestions,
    setShowSuggestions,
  ] = useState(false);

  const [
    quantity,
    setQuantity,
  ] = useState("");

  const [
    averageBuyPrice,
    setAverageBuyPrice,
  ] = useState("");

  const [
    purchaseDate,
    setPurchaseDate,
  ] = useState("");

  const [
    notes,
    setNotes,
  ] = useState("");

  const [
    submittingHolding,
    setSubmittingHolding,
  ] = useState(false);


  // =========================================================
  // EDIT HOLDING STATE
  // =========================================================

  const [
    editingHolding,
    setEditingHolding,
  ] =
    useState<PortfolioHoldingAnalytics | null>(
      null,
    );

  const [
    editQuantity,
    setEditQuantity,
  ] = useState("");

  const [
    editAveragePrice,
    setEditAveragePrice,
  ] = useState("");

  const [
    editNotes,
    setEditNotes,
  ] = useState("");

  const [
    updatingHolding,
    setUpdatingHolding,
  ] = useState(false);


  const searchRequestRef =
    useRef(0);


  // =========================================================
  // LOAD ANALYTICS
  // =========================================================

  const loadAnalytics =
    useCallback(
      async (
        portfolioId: number,
        silent = false,
      ) => {
        try {
          if (!silent) {
            setRefreshing(true);
          }

          setError("");

          const result =
            await getPortfolioAnalytics(
              portfolioId,
            );

          setAnalytics(result);
        } catch (requestError) {
          setAnalytics(null);

          setError(
            getErrorMessage(
              requestError,
            ),
          );
        } finally {
          if (!silent) {
            setRefreshing(false);
          }
        }
      },
      [],
    );


  // =========================================================
  // LOAD PORTFOLIOS
  // =========================================================

  const loadPortfolios =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const result =
          await getPortfolios();

        setPortfolios(result);

        if (
          result.length === 0
        ) {
          setSelectedPortfolioId(
            null,
          );

          setAnalytics(null);

          return;
        }

        const firstPortfolioId =
          result[0].id;

        setSelectedPortfolioId(
          firstPortfolioId,
        );

        await loadAnalytics(
          firstPortfolioId,
          true,
        );
      } catch (requestError) {
        setError(
          getErrorMessage(
            requestError,
          ),
        );
      } finally {
        setLoading(false);
      }
    }, [loadAnalytics]);


  useEffect(() => {
    void loadPortfolios();
  }, [loadPortfolios]);


  // =========================================================
  // LIVE STOCK SEARCH
  // =========================================================

  useEffect(() => {
    const query =
      stockQuery.trim();

    if (query.length < 2) {
      setSearchResults([]);
      setShowSuggestions(false);
      return;
    }

    if (
      selectedSymbol &&
      query === selectedSymbol
    ) {
      return;
    }

    const timeout =
      window.setTimeout(
        async () => {
          const requestId =
            searchRequestRef.current +
            1;

          searchRequestRef.current =
            requestId;

          try {
            setSearching(true);

            const response =
              await searchStocks(
                query,
              );

            if (
              requestId !==
              searchRequestRef.current
            ) {
              return;
            }

            const results =
              Array.isArray(response)
                ? response
                : Array.isArray(
                      response?.results,
                    )
                  ? response.results
                  : Array.isArray(
                        response?.stocks,
                      )
                    ? response.stocks
                    : [];

            setSearchResults(
              results,
            );

            setShowSuggestions(
              results.length > 0,
            );
          } catch {
            if (
              requestId ===
              searchRequestRef.current
            ) {
              setSearchResults([]);
              setShowSuggestions(
                false,
              );
            }
          } finally {
            if (
              requestId ===
              searchRequestRef.current
            ) {
              setSearching(false);
            }
          }
        },
        400,
      );

    return () => {
      window.clearTimeout(
        timeout,
      );
    };
  }, [
    stockQuery,
    selectedSymbol,
  ]);


  // =========================================================
  // SELECT PORTFOLIO
  // =========================================================

  async function handlePortfolioChange(
    portfolioId: number,
  ) {
    setSelectedPortfolioId(
      portfolioId,
    );

    setSuccess("");

    await loadAnalytics(
      portfolioId,
    );
  }


  // =========================================================
  // CREATE PORTFOLIO
  // =========================================================

  async function handleCreatePortfolio(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      !portfolioName.trim()
    ) {
      setError(
        "Enter a portfolio name.",
      );

      return;
    }

    try {
      setSubmittingPortfolio(
        true,
      );

      setError("");
      setSuccess("");

      const created =
        await createPortfolio({
          name:
            portfolioName.trim(),

          description:
            portfolioDescription.trim() ||
            null,
        });

      setPortfolioName("");
      setPortfolioDescription(
        "",
      );

      const updatedPortfolios =
        [
          created,
          ...portfolios,
        ];

      setPortfolios(
        updatedPortfolios,
      );

      setSelectedPortfolioId(
        created.id,
      );

      await loadAnalytics(
        created.id,
      );

      setSuccess(
        "Portfolio created successfully.",
      );
    } catch (requestError) {
      setError(
        getErrorMessage(
          requestError,
        ),
      );
    } finally {
      setSubmittingPortfolio(
        false,
      );
    }
  }


  // =========================================================
  // SELECT STOCK SEARCH RESULT
  // =========================================================

  function handleSelectStock(
    result: SearchResult,
  ) {
    const symbol =
      result.symbol
        ?.trim()
        .toUpperCase();

    if (!symbol) {
      return;
    }

    const companyName =
      result.name ||
      result.company_name ||
      "";

    setSelectedSymbol(symbol);

    setSelectedCompanyName(
      companyName,
    );

    setStockQuery(symbol);

    setSearchResults([]);

    setShowSuggestions(false);

    setError("");
  }


  // =========================================================
  // ADD HOLDING
  // =========================================================

  async function handleAddHolding(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      selectedPortfolioId ===
      null
    ) {
      setError(
        "Create or select a portfolio first.",
      );

      return;
    }

    const finalSymbol =
      (
        selectedSymbol ||
        stockQuery
      )
        .trim()
        .toUpperCase();

    const parsedQuantity =
      Number(quantity);

    const parsedAveragePrice =
      Number(
        averageBuyPrice,
      );

    if (!finalSymbol) {
      setError(
        "Search and select a stock.",
      );

      return;
    }

    if (
      !Number.isFinite(
        parsedQuantity,
      ) ||
      parsedQuantity <= 0
    ) {
      setError(
        "Quantity must be greater than zero.",
      );

      return;
    }

    if (
      !Number.isFinite(
        parsedAveragePrice,
      ) ||
      parsedAveragePrice <= 0
    ) {
      setError(
        "Average buy price must be greater than zero.",
      );

      return;
    }

    const duplicate =
      analytics?.holdings.some(
        (holding) =>
          holding.symbol
            .toUpperCase() ===
          finalSymbol,
      );

    if (duplicate) {
      setError(
        `${finalSymbol} already exists in this portfolio. Edit the existing holding instead.`,
      );

      return;
    }

    try {
      setSubmittingHolding(
        true,
      );

      setError("");
      setSuccess("");

      await addHolding(
        selectedPortfolioId,
        {
          symbol: finalSymbol,

          company_name:
            selectedCompanyName ||
            null,

          quantity:
            parsedQuantity,

          average_buy_price:
            parsedAveragePrice,

          purchase_date:
            purchaseDate
              ? `${purchaseDate}T00:00:00`
              : null,

          notes:
            notes.trim() ||
            null,
        },
      );

      resetHoldingForm();

      await loadAnalytics(
        selectedPortfolioId,
      );

      const updatedPortfolios =
        await getPortfolios();

      setPortfolios(
        updatedPortfolios,
      );

      setSuccess(
        `${finalSymbol} added successfully.`,
      );
    } catch (requestError) {
      setError(
        getErrorMessage(
          requestError,
        ),
      );
    } finally {
      setSubmittingHolding(
        false,
      );
    }
  }


  function resetHoldingForm() {
    setStockQuery("");
    setSelectedSymbol("");
    setSelectedCompanyName(
      "",
    );
    setSearchResults([]);
    setShowSuggestions(false);
    setQuantity("");
    setAverageBuyPrice("");
    setPurchaseDate("");
    setNotes("");
  }


  // =========================================================
  // OPEN EDIT MODAL
  // =========================================================

  function openEditHolding(
    holding:
      PortfolioHoldingAnalytics,
  ) {
    setEditingHolding(
      holding,
    );

    setEditQuantity(
      String(
        holding.quantity,
      ),
    );

    setEditAveragePrice(
      String(
        holding.average_buy_price,
      ),
    );

    setEditNotes("");

    setError("");
    setSuccess("");
  }


  // =========================================================
  // UPDATE HOLDING
  // =========================================================

  async function handleUpdateHolding(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      !editingHolding ||
      selectedPortfolioId ===
        null
    ) {
      return;
    }

    const parsedQuantity =
      Number(editQuantity);

    const parsedPrice =
      Number(
        editAveragePrice,
      );

    if (
      !Number.isFinite(
        parsedQuantity,
      ) ||
      parsedQuantity <= 0
    ) {
      setError(
        "Quantity must be greater than zero.",
      );

      return;
    }

    if (
      !Number.isFinite(
        parsedPrice,
      ) ||
      parsedPrice <= 0
    ) {
      setError(
        "Average buy price must be greater than zero.",
      );

      return;
    }

    try {
      setUpdatingHolding(
        true,
      );

      setError("");
      setSuccess("");

      await updateHolding(
        selectedPortfolioId,
        editingHolding.id,
        {
          quantity:
            parsedQuantity,

          average_buy_price:
            parsedPrice,

          notes:
            editNotes.trim() ||
            null,
        },
      );

      const updatedSymbol =
        editingHolding.symbol;

      setEditingHolding(null);

      await loadAnalytics(
        selectedPortfolioId,
      );

      setSuccess(
        `${updatedSymbol} updated successfully.`,
      );
    } catch (requestError) {
      setError(
        getErrorMessage(
          requestError,
        ),
      );
    } finally {
      setUpdatingHolding(
        false,
      );
    }
  }


  // =========================================================
  // DELETE HOLDING
  // =========================================================

  async function handleDeleteHolding(
    holdingId: number,
    symbol: string,
  ) {
    if (
      selectedPortfolioId ===
      null
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        `Remove ${symbol} from this portfolio?`,
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteHolding(
        selectedPortfolioId,
        holdingId,
      );

      await loadAnalytics(
        selectedPortfolioId,
      );

      const updatedPortfolios =
        await getPortfolios();

      setPortfolios(
        updatedPortfolios,
      );

      setSuccess(
        `${symbol} removed from the portfolio.`,
      );
    } catch (requestError) {
      setError(
        getErrorMessage(
          requestError,
        ),
      );
    }
  }


  // =========================================================
  // UI
  // =========================================================

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      <PageHeader
        title="💼 Portfolio"
        subtitle="Create portfolios, add invested stocks and monitor live performance."
      />


      {error && (
        <div style={errorStyle}>
          {error}
        </div>
      )}


      {success && (
        <div style={successStyle}>
          {success}
        </div>
      )}


      <section style={cardStyle}>
        <h2 style={headingStyle}>
          Create Portfolio
        </h2>

        <p style={mutedStyle}>
          Create separate portfolios
          for long-term investing,
          swing trading or other
          strategies.
        </p>

        <form
          onSubmit={
            handleCreatePortfolio
          }
          style={formGridStyle}
        >
          <input
            value={portfolioName}
            onChange={(event) =>
              setPortfolioName(
                event.target.value,
              )
            }
            placeholder="Portfolio name"
            style={inputStyle}
          />

          <input
            value={
              portfolioDescription
            }
            onChange={(event) =>
              setPortfolioDescription(
                event.target.value,
              )
            }
            placeholder="Description"
            style={inputStyle}
          />

          <button
            type="submit"
            disabled={
              submittingPortfolio
            }
            style={
              primaryButtonStyle
            }
          >
            <Plus size={18} />

            {submittingPortfolio
              ? "Creating..."
              : "Create Portfolio"}
          </button>
        </form>
      </section>


      <section style={cardStyle}>
        <div style={toolbarStyle}>
          <div>
            <h2 style={headingStyle}>
              Active Portfolio
            </h2>

            <p style={mutedStyle}>
              Select a portfolio and
              refresh current market
              values.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <select
              value={
                selectedPortfolioId ??
                ""
              }
              onChange={(event) =>
                void handlePortfolioChange(
                  Number(
                    event.target
                      .value,
                  ),
                )
              }
              disabled={
                portfolios.length ===
                0
              }
              style={inputStyle}
            >
              {portfolios.length ===
                0 && (
                <option value="">
                  No portfolios
                </option>
              )}

              {portfolios.map(
                (portfolio) => (
                  <option
                    key={
                      portfolio.id
                    }
                    value={
                      portfolio.id
                    }
                  >
                    {portfolio.name}
                  </option>
                ),
              )}
            </select>

            <button
              type="button"
              disabled={
                selectedPortfolioId ===
                  null ||
                refreshing
              }
              onClick={() => {
                if (
                  selectedPortfolioId !==
                  null
                ) {
                  void loadAnalytics(
                    selectedPortfolioId,
                  );
                }
              }}
              style={
                secondaryButtonStyle
              }
            >
              <RefreshCw
                size={17}
              />

              {refreshing
                ? "Refreshing..."
                : "Refresh Live Data"}
            </button>
          </div>
        </div>
      </section>


      {loading ? (
        <section style={cardStyle}>
          <p style={mutedStyle}>
            Loading your portfolios...
          </p>
        </section>
      ) : analytics ? (
        <>
          <div style={metricGridStyle}>
            <MetricCard
              icon={
                <CircleDollarSign
                  size={21}
                />
              }
              label="Total Invested"
              value={formatMoney(
                analytics.total_invested,
              )}
            />

            <MetricCard
              icon={
                <WalletCards
                  size={21}
                />
              }
              label="Current Value"
              value={formatMoney(
                analytics.total_current_value,
              )}
            />

            <MetricCard
              icon={
                analytics.total_profit_loss >=
                0 ? (
                  <TrendingUp
                    size={21}
                  />
                ) : (
                  <TrendingDown
                    size={21}
                  />
                )
              }
              label="Total P&L"
              value={formatMoney(
                analytics.total_profit_loss,
              )}
              positive={
                analytics.total_profit_loss >=
                0
              }
            />

            <MetricCard
              icon={
                <BriefcaseBusiness
                  size={21}
                />
              }
              label="Portfolio Return"
              value={`${analytics.total_profit_loss_percent.toFixed(
                2,
              )}%`}
              positive={
                analytics.total_profit_loss_percent >=
                0
              }
            />
          </div>


          <section style={cardStyle}>
            <h2 style={headingStyle}>
              Add Invested Stock
            </h2>

            <p style={mutedStyle}>
              Search for a company,
              select the stock, then
              enter your actual
              investment details.
            </p>

            <form
              onSubmit={
                handleAddHolding
              }
              style={{
                ...formGridStyle,
                alignItems: "start",
              }}
            >
              <div
                style={{
                  position:
                    "relative",
                }}
              >
                <div
                  style={{
                    position:
                      "relative",
                  }}
                >
                  <Search
                    size={17}
                    style={{
                      position:
                        "absolute",
                      left: 13,
                      top: 14,
                      color:
                        "#64748b",
                    }}
                  />

                  <input
                    value={stockQuery}
                    onChange={(
                      event,
                    ) => {
                      setStockQuery(
                        event.target
                          .value,
                      );

                      setSelectedSymbol(
                        "",
                      );

                      setSelectedCompanyName(
                        "",
                      );
                    }}
                    onFocus={() => {
                      if (
                        searchResults.length >
                        0
                      ) {
                        setShowSuggestions(
                          true,
                        );
                      }
                    }}
                    placeholder="Search company or symbol"
                    style={{
                      ...inputStyle,
                      width: "100%",
                      paddingLeft: 40,
                      boxSizing:
                        "border-box",
                    }}
                  />
                </div>

                {searching && (
                  <div
                    style={
                      searchStatusStyle
                    }
                  >
                    Searching...
                  </div>
                )}

                {showSuggestions &&
                  searchResults.length >
                    0 && (
                    <div
                      style={
                        suggestionBoxStyle
                      }
                    >
                      {searchResults.map(
                        (
                          result,
                          index,
                        ) => (
                          <button
                            key={`${result.symbol}-${index}`}
                            type="button"
                            onClick={() =>
                              handleSelectStock(
                                result,
                              )
                            }
                            style={
                              suggestionItemStyle
                            }
                          >
                            <strong
                              style={{
                                color:
                                  "white",
                              }}
                            >
                              {
                                result.symbol
                              }
                            </strong>

                            <span
                              style={{
                                color:
                                  "#94a3b8",
                                fontSize: 12,
                              }}
                            >
                              {result.name ||
                                result.company_name ||
                                "Company"}
                            </span>
                          </button>
                        ),
                      )}
                    </div>
                  )}
              </div>


              <input
                value={quantity}
                onChange={(event) =>
                  setQuantity(
                    event.target
                      .value,
                  )
                }
                type="number"
                min="0"
                step="any"
                placeholder="Quantity"
                style={inputStyle}
              />

              <input
                value={
                  averageBuyPrice
                }
                onChange={(event) =>
                  setAverageBuyPrice(
                    event.target
                      .value,
                  )
                }
                type="number"
                min="0"
                step="any"
                placeholder="Average buy price"
                style={inputStyle}
              />

              <input
                value={purchaseDate}
                onChange={(event) =>
                  setPurchaseDate(
                    event.target
                      .value,
                  )
                }
                type="date"
                style={inputStyle}
              />

              <input
                value={notes}
                onChange={(event) =>
                  setNotes(
                    event.target
                      .value,
                  )
                }
                placeholder="Notes (optional)"
                style={inputStyle}
              />

              <button
                type="submit"
                disabled={
                  submittingHolding
                }
                style={
                  primaryButtonStyle
                }
              >
                <Plus size={18} />

                {submittingHolding
                  ? "Adding..."
                  : "Add Holding"}
              </button>
            </form>

            {selectedSymbol && (
              <div
                style={
                  selectedStockStyle
                }
              >
                Selected:{" "}
                <strong>
                  {selectedSymbol}
                </strong>

                {selectedCompanyName &&
                  ` — ${selectedCompanyName}`}
              </div>
            )}
          </section>


          <section style={cardStyle}>
            <div style={toolbarStyle}>
              <div>
                <h2 style={headingStyle}>
                  Live Holdings
                </h2>

                <p style={mutedStyle}>
                  Status:{" "}
                  {
                    analytics.analytics_status
                  }
                </p>
              </div>

              <strong
                style={{
                  color: "#60a5fa",
                }}
              >
                {
                  analytics.holdings_count
                }{" "}
                holdings
              </strong>
            </div>


            {analytics.holdings
              .length === 0 ? (
              <div style={emptyStyle}>
                No holdings yet. Search
                for your first invested
                stock above.
              </div>
            ) : (
              <div
                style={{
                  overflowX: "auto",
                  marginTop: 20,
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse:
                      "collapse",
                    minWidth: 1150,
                  }}
                >
                  <thead>
                    <tr>
                      {[
                        "Stock",
                        "Qty",
                        "Avg Buy",
                        "Live Price",
                        "Invested",
                        "Current Value",
                        "P&L",
                        "Return",
                        "Status",
                        "Actions",
                      ].map(
                        (header) => (
                          <th
                            key={header}
                            style={
                              tableHeaderStyle
                            }
                          >
                            {header}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    {analytics.holdings.map(
                      (holding) => (
                        <tr
                          key={
                            holding.id
                          }
                        >
                          <td
                            style={
                              tableCellStyle
                            }
                          >
                            <strong
                              style={{
                                color:
                                  "white",
                              }}
                            >
                              {
                                holding.symbol
                              }
                            </strong>

                            <div
                              style={{
                                color:
                                  "#94a3b8",
                                fontSize: 12,
                                marginTop: 4,
                              }}
                            >
                              {holding.company_name ??
                                "Unknown company"}
                            </div>
                          </td>

                          <td
                            style={
                              tableCellStyle
                            }
                          >
                            {
                              holding.quantity
                            }
                          </td>

                          <td
                            style={
                              tableCellStyle
                            }
                          >
                            {formatMoney(
                              holding.average_buy_price,
                            )}
                          </td>

                          <td
                            style={
                              tableCellStyle
                            }
                          >
                            {formatMoney(
                              holding.current_price,
                            )}
                          </td>

                          <td
                            style={
                              tableCellStyle
                            }
                          >
                            {formatMoney(
                              holding.invested_value,
                            )}
                          </td>

                          <td
                            style={
                              tableCellStyle
                            }
                          >
                            {formatMoney(
                              holding.current_value,
                            )}
                          </td>

                          <td
                            style={{
                              ...tableCellStyle,
                              color:
                                (
                                  holding.profit_loss ??
                                  0
                                ) >= 0
                                  ? "#22c55e"
                                  : "#ef4444",
                            }}
                          >
                            {formatMoney(
                              holding.profit_loss,
                            )}
                          </td>

                          <td
                            style={{
                              ...tableCellStyle,
                              color:
                                (
                                  holding.profit_loss_percent ??
                                  0
                                ) >= 0
                                  ? "#22c55e"
                                  : "#ef4444",
                            }}
                          >
                            {holding.profit_loss_percent ===
                            null
                              ? "N/A"
                              : `${holding.profit_loss_percent.toFixed(
                                  2,
                                )}%`}
                          </td>

                          <td
                            style={
                              tableCellStyle
                            }
                          >
                            {
                              holding.data_status
                            }
                          </td>

                          <td
                            style={
                              tableCellStyle
                            }
                          >
                            <div
                              style={{
                                display:
                                  "flex",
                                gap: 8,
                              }}
                            >
                              <button
                                type="button"
                                title="Edit holding"
                                onClick={() =>
                                  openEditHolding(
                                    holding,
                                  )
                                }
                                style={
                                  editButtonStyle
                                }
                              >
                                <Pencil
                                  size={16}
                                />
                              </button>

                              <button
                                type="button"
                                title="Delete holding"
                                onClick={() =>
                                  void handleDeleteHolding(
                                    holding.id,
                                    holding.symbol,
                                  )
                                }
                                style={
                                  dangerButtonStyle
                                }
                              >
                                <Trash2
                                  size={16}
                                />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      ) : (
        <section style={cardStyle}>
          <div style={emptyStyle}>
            Create your first portfolio
            to begin tracking your real
            investments.
          </div>
        </section>
      )}


      {editingHolding && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <div style={toolbarStyle}>
              <div>
                <h2 style={headingStyle}>
                  Edit Holding
                </h2>

                <p style={mutedStyle}>
                  {
                    editingHolding.symbol
                  }
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setEditingHolding(
                    null,
                  )
                }
                style={
                  closeButtonStyle
                }
              >
                <X size={20} />
              </button>
            </div>


            <form
              onSubmit={
                handleUpdateHolding
              }
              style={{
                display: "flex",
                flexDirection:
                  "column",
                gap: 14,
                marginTop: 22,
              }}
            >
              <label style={labelStyle}>
                Quantity

                <input
                  value={
                    editQuantity
                  }
                  onChange={(event) =>
                    setEditQuantity(
                      event.target
                        .value,
                    )
                  }
                  type="number"
                  min="0"
                  step="any"
                  style={{
                    ...inputStyle,
                    width: "100%",
                    boxSizing:
                      "border-box",
                  }}
                />
              </label>


              <label style={labelStyle}>
                Average Buy Price

                <input
                  value={
                    editAveragePrice
                  }
                  onChange={(event) =>
                    setEditAveragePrice(
                      event.target
                        .value,
                    )
                  }
                  type="number"
                  min="0"
                  step="any"
                  style={{
                    ...inputStyle,
                    width: "100%",
                    boxSizing:
                      "border-box",
                  }}
                />
              </label>


              <label style={labelStyle}>
                Notes

                <textarea
                  value={editNotes}
                  onChange={(event) =>
                    setEditNotes(
                      event.target
                        .value,
                    )
                  }
                  placeholder="Update notes"
                  rows={4}
                  style={{
                    ...inputStyle,
                    width: "100%",
                    boxSizing:
                      "border-box",
                    resize:
                      "vertical",
                  }}
                />
              </label>


              <button
                type="submit"
                disabled={
                  updatingHolding
                }
                style={
                  primaryButtonStyle
                }
              >
                {updatingHolding
                  ? "Updating..."
                  : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


type MetricCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  positive?: boolean;
};


function MetricCard({
  icon,
  label,
  value,
  positive,
}: MetricCardProps) {
  return (
    <div style={cardStyle}>
      <div
        style={{
          color: "#60a5fa",
          marginBottom: 14,
        }}
      >
        {icon}
      </div>

      <p style={mutedStyle}>
        {label}
      </p>

      <h3
        style={{
          margin: 0,
          marginTop: 8,
          fontSize: 24,

          color:
            positive === undefined
              ? "white"
              : positive
                ? "#22c55e"
                : "#ef4444",
        }}
      >
        {value}
      </h3>
    </div>
  );
}


const cardStyle: CSSProperties = {
  background: "#111827",
  border: "1px solid #1e293b",
  borderRadius: 16,
  padding: 24,
};


const headingStyle: CSSProperties = {
  color: "white",
  margin: 0,
  marginBottom: 8,
};


const mutedStyle: CSSProperties = {
  color: "#94a3b8",
  margin: 0,
};


const formGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 12,
  marginTop: 18,
};


const inputStyle: CSSProperties = {
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid #334155",
  background: "#0f172a",
  color: "white",
  outline: "none",
  minHeight: 44,
};


const primaryButtonStyle: CSSProperties = {
  minHeight: 44,
  padding: "0 16px",
  border: "none",
  borderRadius: 10,
  background: "#2563eb",
  color: "white",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  fontWeight: 700,
};


const secondaryButtonStyle: CSSProperties =
  {
    ...primaryButtonStyle,
    background: "#1e293b",
    border: "1px solid #334155",
  };


const editButtonStyle: CSSProperties = {
  border: "1px solid #1d4ed8",
  background: "#172554",
  color: "#93c5fd",
  borderRadius: 8,
  width: 38,
  height: 38,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};


const dangerButtonStyle: CSSProperties = {
  border: "1px solid #7f1d1d",
  background: "#450a0a",
  color: "#fca5a5",
  borderRadius: 8,
  width: 38,
  height: 38,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};


const closeButtonStyle: CSSProperties = {
  border: "1px solid #334155",
  background: "#1e293b",
  color: "white",
  borderRadius: 8,
  width: 40,
  height: 40,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};


const metricGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(210px, 1fr))",
  gap: 16,
};


const toolbarStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 16,
  flexWrap: "wrap",
};


const tableHeaderStyle: CSSProperties = {
  textAlign: "left",
  padding: "14px 12px",
  color: "#94a3b8",
  fontSize: 13,
  borderBottom: "1px solid #334155",
};


const tableCellStyle: CSSProperties = {
  padding: "16px 12px",
  color: "#cbd5e1",
  borderBottom: "1px solid #1e293b",
  verticalAlign: "middle",
};


const emptyStyle: CSSProperties = {
  marginTop: 18,
  padding: 24,
  borderRadius: 12,
  background: "#0f172a",
  border: "1px dashed #334155",
  color: "#94a3b8",
  textAlign: "center",
};


const errorStyle: CSSProperties = {
  padding: 14,
  borderRadius: 10,
  border: "1px solid #7f1d1d",
  background: "#450a0a",
  color: "#fecaca",
};


const successStyle: CSSProperties = {
  padding: 14,
  borderRadius: 10,
  border: "1px solid #166534",
  background: "#052e16",
  color: "#bbf7d0",
};


const suggestionBoxStyle: CSSProperties = {
  position: "absolute",
  zIndex: 100,
  top: 50,
  left: 0,
  right: 0,
  maxHeight: 280,
  overflowY: "auto",
  background: "#111827",
  border: "1px solid #334155",
  borderRadius: 10,
  boxShadow:
    "0 20px 40px rgba(0,0,0,0.35)",
};


const suggestionItemStyle: CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  border: "none",
  borderBottom:
    "1px solid #1e293b",
  background: "transparent",
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: 4,
  textAlign: "left",
};


const searchStatusStyle: CSSProperties = {
  position: "absolute",
  right: 12,
  top: 14,
  fontSize: 12,
  color: "#94a3b8",
};


const selectedStockStyle: CSSProperties = {
  marginTop: 14,
  padding: "10px 14px",
  borderRadius: 8,
  background: "#172554",
  border: "1px solid #1d4ed8",
  color: "#bfdbfe",
};


const modalOverlayStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 1000,
  background:
    "rgba(2, 6, 23, 0.82)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
};


const modalStyle: CSSProperties = {
  width: "100%",
  maxWidth: 520,
  background: "#111827",
  border: "1px solid #334155",
  borderRadius: 16,
  padding: 24,
  boxShadow:
    "0 30px 80px rgba(0,0,0,0.5)",
};


const labelStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
  color: "#cbd5e1",
  fontSize: 14,
};