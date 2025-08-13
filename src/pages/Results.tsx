                <Link
                  to={`/play?jump=${s.id}`}
                  className="underline underline-offset-4"
                >
                  {s.title}
                </Link>
                {userChoice?.rationale && (
                  <p className="text-xs text-muted-foreground mt-1">{userChoice.rationale}</p>
                )}