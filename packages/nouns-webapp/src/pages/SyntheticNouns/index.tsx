import { Trans } from '@lingui/macro';
import { TransactionStatus } from '@usedapp/core';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Col, Container, Row, Spinner } from 'react-bootstrap';
import { NavBarButtonStyle } from '../../components/NavBarButton';
import NavWallet from '../../components/NavWallet';
import Noun from '../../components/Noun';
import { useAppSelector } from '../../hooks';
import { useClaimNoun, useNounClaimed, useNounPreview } from '../../wrappers/syntheticNounToken';
import classes from './SyntheticNouns.module.css';

const SyntheticNouns: React.FC = () => {
  const activeAccount = useAppSelector(state => state.account.activeAccount);
  const nounPreview = useNounPreview(activeAccount);
  const nounClaimed = useNounClaimed(activeAccount);
  const { claimNoun, claimNounState } = useClaimNoun();

  const [isLoading, setIsLoading] = useState(false);

  const handleClaimStatusChanged = useCallback((state: TransactionStatus) => {
    switch (state.status) {
      case 'None':
        setIsLoading(false);
        break;
      case 'Mining':
        setIsLoading(true);
        break;
      case 'Success':
        setIsLoading(false);
        // setIsVoteSuccessful(true);
        break;
      case 'Fail':
        // setFailureCopy(<Trans>Transaction Failed</Trans>);
        // setErrorMessage(state?.errorMessage || <Trans>Please try again.</Trans>);
        setIsLoading(false);
        break;
      case 'Exception':
        // setFailureCopy(<Trans>Error</Trans>);
        // setErrorMessage(
        //   getVoteErrorMessage(state?.errorMessage) || <Trans>Please try again.</Trans>,
        // );
        setIsLoading(false);
        // setIsVoteFailed(true);
        break;
    }
  }, []);

  useEffect(() => {
    handleClaimStatusChanged(claimNounState);
  }, [claimNounState]);

  useEffect(() => {
    console.log('nounpreview changed', nounPreview);
  }, [nounPreview]);

  return (
    <>
      <Container fluid="lg">
        <Row>
          <Col lg={10} className={classes.headerRow}>
            <span>
              <Trans>Explore</Trans>
            </span>
            <h1>
              <Trans>Synthetic Nouns</Trans>
            </h1>
            <p>
              {/* TODO: Mention gas subsidy */}
              <Trans>
                There is a unique, free to claim Synthetic Noun for every Ethereum address. They are
                transferable but the description contains the original minter's address or ENS name.
              </Trans>
            </p>
          </Col>
        </Row>
        <Row xs={10}>
          {nounPreview ? (
            <Col xs={12} sm={5} lg={3}>
              <Noun
                imgPath={`data:image/svg+xml;base64,${nounPreview}`}
                alt="noun"
                className={classes.nounImg}
                wrapperClassName={classes.nounWrapper}
              />
              <Row>
                <Button
                  onClick={() => {
                    if (nounClaimed === undefined || isLoading) {
                      return;
                    }
                    setIsLoading(true);
                    claimNoun();
                  }}
                  className={classes.primaryBtn}
                  disabled={nounClaimed === true}
                >
                  {isLoading ? (
                    <Spinner animation="border" />
                  ) : (
                    <Trans>{nounClaimed ? 'Noun already claimed' : 'Claim for free'}</Trans>
                  )}
                </Button>
              </Row>
            </Col>
          ) : (
            !activeAccount && (
              <Col lg={10} className={classes.headerRow}>
                <Row xs={1} lg={5}>
                  <Trans>Connect your wallet to view preview your Synthetic Noun.</Trans>
                </Row>
                <Row xs={1} lg={5}>
                  <NavWallet
                    address={activeAccount || '0'}
                    buttonStyle={NavBarButtonStyle.WHITE_INFO}
                  />{' '}
                </Row>
              </Col>
            )
          )}
        </Row>
      </Container>
    </>
  );
};
export default SyntheticNouns;
