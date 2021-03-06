# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  # Update the server
  # qq represents quiet level 2. Level 2 is the max and implies -y.
  config.vm.provision :shell, :inline => "apt-get update --fix-missing -qq"

  # If true, then any SSH connections made will enable agent forwarding.
  # Default value: false
  config.ssh.forward_agent = true

  config.ssh.private_key_path = [ '~/.vagrant.d/insecure_private_key', '~/.ssh/id_rsa' ]

  config.vm.define :dev do |dev_config|
    
    # Every Vagrant virtual environment requires a box to build off of.
    dev_config.vm.box = "precise64"

    # The url from where the 'dev_config.vm.box' box will be fetched if it
    # doesn't already exist on the user's system.
    dev_config.vm.box_url = "http://files.vagrantup.com/precise64.box"
    
    # Create a forwarded port mapping which allows access to a specific port
    # within the machine from a port on the host machine. In the example below,
    # accessing "localhost:8080" will access port 80 on the guest machine.
    dev_config.vm.network :forwarded_port, guest: 80, host: 8080

    # Create a public network, which generally matched to bridged network.
    # Bridged networks make the machine appear as another physical device on
    # your network.
    # dev_config.vm.network :public_network

    # Provider-specific configuration so you can fine-tune various
    # backing providers for Vagrant. These expose provider-specific options.
    # Example for VirtualBox:
    dev_config.vm.provider :virtualbox do |vbox|
      vbox.gui = false
      vbox.name = "acutis"
      vbox.customize ["modifyvm", :id, "--cpuexecutioncap", "90"]
      vbox.customize ["modifyvm", :id, "--memory", "512"]
    end

    # Enable provisioning with Puppet stand alone.  Puppet manifests
    # are contained in a directory path relative to this Vagrantfile.
    # You will need to create the manifests directory and a manifest in
    # the file base.pp in the manifests_path directory.
    dev_config.vm.provision :puppet do |puppet|
      puppet.manifests_path = "puppet/manifests"
      puppet.manifest_file  = "site.pp"
      puppet.module_path = "puppet/modules"
      puppet.facter = {
        "node_env" => "development"
      }
      # puppet.options = "--verbose --debug"
    end

  end

  config.vm.define :prod do |prod_config|
    
    # Every Vagrant virtual environment requires a box to build off of.
    prod_config.vm.box = "digital_ocean"

    # The url from where the 'prod_config.vm.box' box will be fetched if it
    # doesn't already exist on the user's system.
    prod_config.vm.box_url = "https://github.com/smdahlen/vagrant-digitalocean/raw/master/box/digital_ocean.box"

    prod_config.ssh.private_key_path = '~/.ssh/id_rsa'

    prod_config.vm.provision :shell, :inline => "apt-get install -y puppet-common"
    
    # Provider-specific configuration so you can fine-tune various
    # backing providers for Vagrant. These expose provider-specific options.
    # Example for Digital Ocean:
    prod_config.vm.provider :digital_ocean do |docean|      
      docean.client_id = "0f8015696b2f1b394c81908949859cec"
      docean.api_key = "9e23f307422587b041bd1df029f5299b"
      docean.image = "Ubuntu 12.04.3 x32"
      docean.region = "New York 2"
      docean.size = "512MB"
    end

    # Enable provisioning with Puppet stand alone.  Puppet manifests
    # are contained in a directory path relative to this Vagrantfile.
    # You will need to create the manifests directory and a manifest in
    # the file base.pp in the manifests_path directory.
    prod_config.vm.provision :puppet do |puppet|
      puppet.manifests_path = "puppet/manifests"
      puppet.manifest_file  = "site.pp"
      puppet.module_path = "puppet/modules"
      puppet.facter = {
        "node_env" => "production"
      }
      # puppet.options = "--verbose --debug"
    end

  end

  # Share an additional folder to the guest VM. The first argument is
  # the path on the host to the actual folder. The second argument is
  # the path on the guest to mount the folder. And the optional third
  # argument is a set of non-required options.
  # config.vm.synced_folder "../data", "/vagrant_data"

end
