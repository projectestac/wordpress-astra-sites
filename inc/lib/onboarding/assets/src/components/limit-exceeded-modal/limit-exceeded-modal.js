import { renderToString } from 'react-dom/server';
import { ExclamationTriangleColorfulIcon } from '../../steps/ui/icons';
import Modal from '../../components/modal';
import Button from '../button/button';
import { __, sprintf } from '@wordpress/i18n';
import { useStateValue } from '../../store/store';

const LimitExceedModal = ( { onOpenChange, openTarget = '_blank' } ) => {
	const [ { limitExceedModal }, dispatch ] = useStateValue();

	const planName = (
		<span className="zw-base-semibold text-app-heading capitalize">
			{ astraSitesVars?.zip_plans?.active_plan?.slug }
		</span>
	);

	const teamName = (
		<span className="zw-base-semibold text-app-heading">
			{ astraSitesVars?.zip_plans?.team?.name }
		</span>
	);

	const teamPlanInfo = (
		<span
			dangerouslySetInnerHTML={ {
				__html: sprintf(
					/* translators: %1$s: team name, %2$s: plan name */
					__(
						'Your current active organization is %1$s, which is on the %2$s plan.',
						'astra-sites'
					),
					renderToString( teamName ),
					renderToString( planName )
				),
			} }
		/>
	);

	const dailyLimit = (
		<span className="zw-base-semibold text-app-heading ">
			{ sprintf(
				/* translators: %s: daily limit */
				__( '%s AI sites', 'astra-sites' ),
				astraSitesVars?.zip_plans?.plan_data?.limit
					?.ai_sites_count_daily
			) }
		</span>
	);

	const aiSitesCount =
		astraSitesVars?.zip_plans?.plan_data?.remaining?.ai_sites_count_daily;

	const displayMessage = (
		<span
			dangerouslySetInnerHTML={ {
				__html:
					typeof aiSitesCount === 'number' && aiSitesCount <= 0
						? `
				<br />
					${ sprintf(
						/* translators: %s: daily limit */
						__(
							'This plan allows you to generate %s per day, and you have reached this limit.',
							'astra-sites'
						),
						renderToString( dailyLimit )
					) }
					<br />
					<br />
					${ __(
						'To create more AI websites, you will need to either upgrade your plan or wait until the limit resets.',
						'astra-sites'
					) }
				`
						: `
				${ sprintf(
					/* translators: %s: plan name */
					__(
						'You have reached the maximum number of sites allowed to be created on %s plan.',
						'astra-sites'
					),
					renderToString( planName )
				) }
				<br />
				<br />
				${ sprintf(
					/* translators: %s: team name */
					__(
						'Please upgrade the plan for %s in order to create more sites.',
						'astra-sites'
					),
					renderToString( teamName )
				) }
				`,
			} }
		/>
	);

	return (
		<Modal
			open={ limitExceedModal.open }
			setOpen={ ( toggle ) => {
				if ( typeof onOpenChange === 'function' ) {
					onOpenChange( toggle );
				}

				dispatch( {
					type: 'set',
					limitExceedModal: {
						...limitExceedModal,
						open: toggle,
					},
				} );
			} }
			width={ 464 }
			height="200"
			overflowHidden={ false }
		>
			<Modal.Title>
				<ExclamationTriangleColorfulIcon className="w-6 h-6" />
				<span>{ __( 'Limit reached', 'astra-sites' ) }</span>
			</Modal.Title>
			<div className="space-y-8">
				<div className="text-app-text text-base leading-6">
					<div>
						{ teamPlanInfo }
						{ displayMessage }
					</div>
				</div>
				<Button
					className="!bg-accent-st hover:!bg-accent-st w-full !text-base"
					onClick={ () => {
						dispatch( {
							type: 'set',
							limitExceedModal: {
								...limitExceedModal,
								open: false,
							},
						} );
						if ( typeof window === 'undefined' ) {
							return;
						}
						window.open(
							'https://app.zipwp.com/founders-deal',
							openTarget
						);
					} }
				>
					{ __( 'Unlock Full Power', 'astra-sites' ) }
				</Button>
			</div>
		</Modal>
	);
};

export default LimitExceedModal;
